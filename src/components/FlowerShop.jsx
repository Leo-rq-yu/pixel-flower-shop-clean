import React, { useState, useEffect } from 'react'
import { createClient } from '@insforge/sdk'
import './FlowerShop.css'

// 在组件外部创建客户端，避免重复创建
const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL || 'https://349i2i7p.us-east.insforge.app'
const apiKey = import.meta.env.VITE_INSFORGE_API_KEY || 'ik_6b40c6c81d849529a87e4ee3de3080f5'

console.log('Creating Insforge client with:', { baseUrl, apiKey: apiKey ? 'Present' : 'Missing' })

const client = createClient({ 
  baseUrl: baseUrl,
  apiKey: apiKey,
  // 尝试使用API密钥作为访问令牌
  accessToken: apiKey
})

const FlowerShop = () => {
  const [showDialog, setShowDialog] = useState(true) // 一开始就显示
  const [flowerType, setFlowerType] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [showResult, setShowResult] = useState(false)


  const handleOrder = async () => {
    if (!flowerType.trim()) {
      alert('请输入您想要的花卉类型！')
      return
    }

    setIsGenerating(true)
    setShowDialog(false)

    try {
      // 使用Gemini生成Studio Ghibli x Stardew Valley风格的花卉图片
      const prompt = `Studio Ghibli x Stardew Valley aesthetic, warm and detailed, 32-bit pixel texture, isometric perspective, high resolution, cozy mood. Beautiful ${flowerType} flowers in a charming pixel art style with soft lighting and warm colors.`
      
      console.log('🌺 Generating flower image with Insforge AI...')
      console.log('Prompt:', prompt)
      
      // 尝试先进行用户认证
      console.log('🔐 Attempting user authentication...')
      
      try {
        // 尝试注册一个匿名用户
        const authResult = await client.auth.signUp({
          email: `anonymous-${Date.now()}@flower-shop.com`,
          password: 'anonymous123'
        })
        console.log('✅ User authenticated:', authResult)
      } catch (authError) {
        console.log('⚠️ Auth failed, trying with API key:', authError.message)
      }
      
      const response = await client.ai.images.generate({
        model: 'google/gemini-2.5-flash-image-preview',
        prompt: prompt
      })

      console.log('AI Response:', response)

      if (response.data && response.data[0]) {
        const base64Image = response.data[0].b64_json
        const imageUrl = `data:image/png;base64,${base64Image}`
        setGeneratedImage(imageUrl)
        setShowResult(true)
        console.log('✅ Image generated successfully!')
      } else {
        throw new Error('No image generated')
      }
    } catch (error) {
      console.error('❌ Error generating image:', error)
      
      // 如果是认证错误，提供更友好的错误信息
      if (error.message.includes('No token provided') || error.message.includes('401')) {
        alert('AI服务需要认证，请稍后重试或联系管理员')
      } else {
        alert(`生成图片时出现错误: ${error.message}`)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flower-shop-container">
      {/* 像素风格对话框 - 固定在收银台位置，一开始就显示 */}
      {showDialog && (
        <div className="pixel-dialog">
          <div className="pixel-dialog-content">
            <div className="pixel-dialog-header">
              <h3>🌸 Welcome to flower shop!</h3>
            </div>
            <p className="pixel-dialog-text">What flower do you want?</p>
            <input
              type="text"
              value={flowerType}
              onChange={(e) => setFlowerType(e.target.value)}
              placeholder="Enter flower type..."
              className="pixel-input"
              autoFocus
            />
            <div className="pixel-dialog-buttons">
              <button 
                className="pixel-order-btn"
                onClick={handleOrder}
                disabled={isGenerating}
              >
                {isGenerating ? '✨ Generating...' : 'Order'}
              </button>
              <button 
                className="pixel-cancel-btn"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

            {/* 生成中状态 */}
            {isGenerating && (
              <div className="generating-overlay">
                <div className="generating-content">
                  <div className="magic-spinner">🌺</div>
                  <h3>The shopkeeper is getting your flowers...</h3>
                  <p>Please wait while we prepare your beautiful bouquet</p>
                </div>
              </div>
            )}

      {/* 生成结果 */}
      {showResult && generatedImage && (
        <div className="result-overlay">
          <div className="result-content pixel-style">
            <div className="result-header">
            </div>
                  <div className="generated-image-container">
                    <img 
                      src={generatedImage} 
                      alt={`Generated ${flowerType}`}
                      className="generated-image"
                    />
                  </div>
            <div className="result-actions">
              <button 
                className="new-order-btn pixel-btn"
                onClick={() => {
                  setShowResult(false)
                  setShowDialog(true)
                }}
              >
                Order More
              </button>
              <button 
                className="close-result-btn pixel-btn-secondary"
                onClick={() => {
                  // 下载图片
                  const link = document.createElement('a')
                  link.href = generatedImage
                  link.download = `${flowerType}-flower-${Date.now()}.png`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 底部署名 */}
      <div className="footer-credit">
        <p>Made by Sam Liu</p>
        <a href="https://www.linkedin.com/in/sam-liu-025b871a2/" target="_blank" rel="noopener noreferrer">
          @https://www.linkedin.com/in/sam-liu-025b871a2/
        </a>
      </div>
    </div>
  )
}

export default FlowerShop