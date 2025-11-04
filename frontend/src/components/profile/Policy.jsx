import React, { useEffect, useState } from 'react'
import { getPolicy } from '../../services/apiService'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, UserCheck, Database, ChevronDown, ChevronUp, Calendar, FileText, Clock } from 'lucide-react'

const Policy = () => {
  const navigate = useNavigate()
  const [policyContent, setPolicyContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState('')
  const [expandedSections, setExpandedSections] = useState({})
  const [activeTab, setActiveTab] = useState('fullPolicy')

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true)
        const policyData = await getPolicy()
        setPolicyContent(policyData.content)
        setLastUpdated(policyData.lastUpdated || new Date().toISOString().split('T')[0])
        
        // Initialize section expansion state
        if (policyData.content) {
          const sections = policyData.content.split('\n\n').filter(section => section.trim().length > 0)
          const initialExpandedState = {}
          sections.forEach((_, index) => {
            initialExpandedState[index] = index === 0 // Expand first section only
          })
          setExpandedSections(initialExpandedState)
        }
      } catch (err) {
        setError('Failed to load privacy policy. Please try again later.')
        console.error('Error fetching policy:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPolicy()
  }, [])

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading Privacy Policy</h2>
          <p className="text-gray-600 mt-2">We're retrieving our privacy information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Policy</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Split content into sections for better organization
  const sections = policyContent ? policyContent.split('\n\n').filter(section => section.trim().length > 0) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200 mr-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
              <Shield className="w-8 h-8 mr-3 text-blue-500" />
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center mt-2 text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Last updated: {formatDate(lastUpdated)}</span>
            </div>
          </div>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-md border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Data Protection</h3>
            </div>
            <p className="text-sm text-gray-600">We implement security measures to protect your personal information.</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Transparency</h3>
            </div>
            <p className="text-sm text-gray-600">We clearly communicate how we collect and use your data.</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Your Rights</h3>
            </div>
            <p className="text-sm text-gray-600">You have control over your personal information and how it's used.</p>
          </div>
        </div>

        {/* Policy Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'fullPolicy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('fullPolicy')}
            >
              <FileText className="w-5 h-5 inline-block mr-2" />
              Full Policy
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'keyPoints' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('keyPoints')}
            >
              <Database className="w-5 h-5 inline-block mr-2" />
              Key Points
            </button>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200 p-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Privacy Overview</h2>
            <p className="text-gray-600 mt-1">Your privacy is important to us. This policy explains what data we collect and how we use it.</p>
          </div>

          <div className="p-6">
            {sections.length > 0 ? (
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition duration-200"
                      onClick={() => toggleSection(index)}
                    >
                      <h3 className="font-medium text-gray-800 text-left">
                        Section {index + 1}
                      </h3>
                      {expandedSections[index] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSections[index] && (
                      <div className="p-4 bg-white">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No policy content available.</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center text-gray-600 mb-4 sm:mb-0">
                <Clock className="w-4 h-4 mr-2" />
                <span>Estimated reading time: 10 minutes</span>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Have Questions?
          </h3>
          <p className="text-blue-700">
            If you have any questions about our privacy practices or this policy, please contact our privacy team at privacy@example.com.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Policy