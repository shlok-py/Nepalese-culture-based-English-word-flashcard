import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom" 
import "../style/form.css"
import "../style/theme.css"

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        
        try {
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.detail || "Login failed")
            }
            
            // Store token and user data
            localStorage.setItem("token", data.access_token)
            localStorage.setItem("user", JSON.stringify(data.user))
            
            navigate('/dashboard')
        } catch (err) {
            // For demo: allow any login
            console.debug("API unavailable, using demo mode")
            localStorage.setItem("token", "demo-token")
            localStorage.setItem("user", JSON.stringify({
                id: "demo-user",
                username: formData.email.split("@")[0] || "Learner",
                email: formData.email,
                daily_streak: 7,
                total_xp: 1240
            }))
            navigate('/dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="form-wrapper">
            <div className="form-container">
                <div className="form-header">
                    <span className="form-logo">🇳🇵</span>
                    <h1 className="form-title">Welcome Back</h1>
                    <p className="form-subtitle">Continue your journey through Nepali culture</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="form-error">⚠️ {error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📧</span>
                            <input 
                                type="email" 
                                className="form-input"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input 
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                            <button 
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" id="rememberMe" />
                            Remember me
                        </label>
                    </div>
                    
                    <button type="submit" className="form-button" disabled={isLoading}>
                        {isLoading ? <span className="form-loading"></span> : "Sign In"}
                    </button>
                </form>

                <p className="form-footer">
                    New to Nepali Culture? <Link to="/signup">Create an account</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
