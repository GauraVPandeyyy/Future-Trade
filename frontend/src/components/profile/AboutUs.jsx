import React, { useEffect, useState } from "react";
import { getAboutUs } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Heart, 
  Award, 
  Globe, 
  Clock,
  ChevronRight,
  Star,
  Calendar,
  BarChart3
} from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();
  const [aboutUsContent, setAboutUsContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const data = await getAboutUs();
        setAboutUsContent(data.about_us);
        
        // Simulate additional data that might come from API
        setTeamMembers([
          { name: "Sarah Johnson", role: "CEO & Founder", years: 8 },
          { name: "Michael Chen", role: "CTO", years: 6 },
          { name: "Elena Rodriguez", role: "Design Director", years: 5 },
          { name: "David Kim", role: "Operations Manager", years: 4 }
        ]);
        
        setStats([
          { icon: <Globe className="w-6 h-6" />, value: "15+", label: "Countries Served" },
          { icon: <Users className="w-6 h-6" />, value: "10,000+", label: "Happy Clients" },
          { icon: <Award className="w-6 h-6" />, value: "25+", label: "Industry Awards" },
          { icon: <Calendar className="w-6 h-6" />, value: "8", label: "Years Experience" }
        ]);
      } catch {
        setAboutUsContent(
          "Sorry, we couldn't load the About Us content at this time. Please try again later or contact our team for more information about our company, mission, and values."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAboutUs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative inline-block">
            <svg
              className="animate-spin h-16 w-16 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="status"
              aria-label="Loading spinner"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <Users className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-800">Loading Our Story</h2>
          <p className="mt-2 text-gray-600">We're gathering information about our team and mission...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-200 mr-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center">
              <Users className="w-10 h-10 mr-3 text-indigo-500" />
              About Our Company
            </h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Learn about our mission, values, and the team behind our success
            </p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-md border border-indigo-100 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
          <div className="p-8 md:p-12">
            <div className="flex items-start mb-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  {aboutUsContent.split("\n").map((para, index) => (
                    <p key={index} className="mb-6 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Heart className="w-6 h-6 text-red-500 mr-3" />
                Our Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                      <Star className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Excellence</h4>
                  </div>
                  <p className="text-gray-600 text-sm">We strive for the highest quality in everything we do, continuously improving our products and services.</p>
                </div>
                
                <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Collaboration</h4>
                  </div>
                  <p className="text-gray-600 text-sm">We believe in the power of teamwork and building strong relationships with our clients and partners.</p>
                </div>
                
                <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Innovation</h4>
                  </div>
                  <p className="text-gray-600 text-sm">We embrace change and constantly seek new ways to solve problems and create value for our customers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Users className="w-7 h-7 text-indigo-600 mr-3" />
              Meet Our Leadership Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <span className="text-2xl font-semibold text-indigo-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-indigo-600 text-sm mb-2">{member.role}</p>
                  <div className="flex items-center justify-center text-gray-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{member.years} years with us</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                View Full Team <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Want to join our team?</h2>
          <p className="mb-6 max-w-2xl mx-auto opacity-90">
            We're always looking for talented individuals who share our passion and values.
          </p>
          <button className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-200">
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;