import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    email: '',
  })
  const [profilePic, setProfilePic] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const form = new FormData()
      form.append('user[name]', formData.name)
      form.append('user[password]', formData.password)
      form.append('user[password_confirmation]', formData.password_confirmation)
      form.append('user[phone_number]', formData.phone_number)
      form.append('user[email]', formData.email)
      if (profilePic) {
        form.append('user[avatar]', profilePic)
      }
      const response = await fetch('/users', {
        method: 'POST',
        body: form
      })
      if (response.ok) {
        navigate('/login')
      } else {
        const data = await response.json()
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/images/2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '50px 0'
      }}
    >
      <div className="absolute inset-0 bg-gray bg-opacity-30 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-xl flex flex-col items-center"
        style={{ background: 'rgba(255,255,255,0.25)', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', border: '1px solid rgba(255,255,255,0.18)' }}>
        <h2 className="text-3xl font-semibold text-black mb-8 text-center">Sign up</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <input
            type="text"
            name="name"
            placeholder="Username"
            required
            className="rounded-lg px-2 py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="rounded-lg px-4 py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Repeat password"
            required
            className="rounded-lg px-4 py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            value={formData.password_confirmation}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone_number"
            placeholder="Number"
            required
            className="rounded-lg px-4 py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            value={formData.phone_number}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="rounded-lg px-4 py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="flex items-center gap-4">
            <label className="text-white text-lg flex-1">Profile picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="flex-1 bg-white rounded-lg px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-blue-700 hover:bg-blue-800 text-white text-lg py-3 font-semibold shadow-lg transition"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp 