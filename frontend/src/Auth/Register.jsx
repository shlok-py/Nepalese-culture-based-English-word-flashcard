import React,{ useState} from "react"
import {useNavigate} from "react-router-dom" 
import "../style/form.css"

const Signup = () => {

const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Signup attempt:", formData)
        navigate('/landing')
    }

    return (
        <div className="form-container">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input 
                        type="email" 
                        className="form-input"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        aria-describedby="emailHelp"
                        placeholder="Enter your email"
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-input"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />
                </div>
                
                <div className="mb-3 form-check">
                    <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="rememberMe"
                        />
                    <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                    </label>
                </div>
                
                <button type="submit" className="form-button">Signup</button>
            </form>
        </div>
    )
}

export default Signup
