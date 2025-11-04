import React, { useEffect, useState } from 'react'
import { getTerms } from '../../services/apiService'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Scale, Shield, Lock, ChevronDown, ChevronUp } from 'lucide-react'

const TermConditions = () => {
  const navigate = useNavigate()
  const [termsContent, setTermsContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true)
        const termsContent = await getTerms()
        setTermsContent(termsContent.terms)
        
        // Initialize all sections as collapsed
        const sections = termsContent.terms.split('\n\n').filter(section => section.trim().length > 0)
        const initialExpandedState = {}
        sections.forEach((_, index) => {
          initialExpandedState[index] = false
        })
        // Auto-expand first section
        if (sections.length > 0) {
          initialExpandedState[0] = true
        }
        setExpandedSections(initialExpandedState)
      } catch (err) {
        setError('Failed to load terms and conditions. Please try again later.')
        console.error('Error fetching terms:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTerms()
  }, [])

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading Terms & Conditions</h2>
          <p className="text-gray-600 mt-2">Please wait while we retrieve our terms...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Content</h2>
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
  const sections = termsContent.split('\n\n').filter(section => section.trim().length > 0)

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
              <Scale className="w-8 h-8 mr-3 text-blue-500" />
              Terms & Conditions
            </h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl p-5 shadow-md border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Legal Document</h3>
            </div>
            <p className="text-sm text-gray-600">This document outlines the rules and guidelines for using our services.</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Your Protection</h3>
            </div>
            <p className="text-sm text-gray-600">These terms are designed to protect both you and our services.</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Privacy Matters</h3>
            </div>
            <p className="text-sm text-gray-600">We value your privacy and outline how we handle your data.</p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 p-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Terms Overview</h2>
            <p className="text-gray-600 mt-1">Please read these terms carefully before using our service.</p>
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
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No terms content available.</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 sm:mb-0">
              By using our service, you agree to these terms and conditions.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center"
            >
              I Understand
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>For questions about these terms, please contact our support team.</p>
        </div>
      </div>
    </div>
  )
}

export default TermConditions