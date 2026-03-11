import { useState } from "react"
import { Sparkles, Search, Loader2 } from 'lucide-react'


function SkinWise() {
  const [formData, setFormData] = useState({
    query: "",
    productPreferences: "",
    skinConcerns: "",
    skinType: "",
    skinDescription: "",
    spendMostTime: ""
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("search") // "search" or "results"

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://127.0.0.1:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: formData.query,
          "product-preferences": formData.productPreferences,
          "skin-concerns": formData.skinConcerns,
          "skin-type": formData.skinType,
          "skin-description": formData.skinDescription,
          "spend-most-time": formData.spendMostTime
        })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setResults(data.results || [])
      if (data.results?.length > 0) {
        setActiveTab("results")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-rose-500 mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-teal-500">
                SkinWise
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find the perfect skincare products tailored to your unique skin profile and preferences
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("search")}
                className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${activeTab === "search"
                    ? "text-rose-600 dark:text-rose-400 border-b-2 border-rose-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab("results")}
                disabled={results.length === 0}
                className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${activeTab === "results" && results.length > 0
                    ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-500"
                    : results.length === 0
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                Results {results.length > 0 && `(${results.length})`}
              </button>
            </div>

            <div className={`transition-all duration-300 ${activeTab === "search" ? "block" : "hidden"}`}>
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      What are you looking for?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="query"
                        placeholder="E.g., Moisturizer for dry skin, Anti-aging serum..."
                        value={formData.query}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                      />
                      <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Preferences
                    </label>
                    <input
                      type="text"
                      name="productPreferences"
                      placeholder="E.g., Fragrance-free, Vegan, Cruelty-free..."
                      value={formData.productPreferences}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skin Concerns
                    </label>
                    <input
                      type="text"
                      name="skinConcerns"
                      placeholder="E.g., Acne, Wrinkles, Hyperpigmentation..."
                      value={formData.skinConcerns}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skin Type
                    </label>
                    <select
                      name="skinType"
                      value={formData.skinType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                    >
                      <option value="">Select skin type...</option>
                      <option value="oily">Oily</option>
                      <option value="dry">Dry</option>
                      <option value="combination">Combination</option>
                      <option value="normal">Normal</option>
                      <option value="sensitive">Sensitive</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Where do you spend most time?
                    </label>
                    <select
                      name="spendMostTime"
                      value={formData.spendMostTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                    >
                      <option value="">Select environment...</option>
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Describe your skin
                    </label>
                    <textarea
                      name="skinDescription"
                      placeholder="Tell us more about your skin, concerns, and what you're looking for..."
                      value={formData.skinDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200 resize-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 bg-gradient-to-r from-rose-500 to-teal-500 hover:from-rose-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Searching...
                    </>
                  ) : (
                    <>Find Perfect Products</>
                  )}
                </button>
              </form>
            </div>

            <div className={`transition-all duration-300 ${activeTab === "results" ? "block" : "hidden"}`}>
              {results.length > 0 ? (
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800/50 flex flex-col h-full"
                      >
                        {result.image_url && (
                          <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
                              src={result.image_url || "/placeholder.svg"}
                              alt={result.name}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg?height=200&width=400"
                                e.target.alt = "Product image unavailable"
                              }}
                            />
                            <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {result.match_score}% Match
                            </div>
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="mb-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {result.brand}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                              {result.name}
                            </h3>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-300">{result.category}</span>
                              <span className="text-lg font-medium text-teal-600 dark:text-teal-400">{result.price}</span>
                            </div>
                          </div>

                          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                            {result.description}
                          </p>

                          <div className="mt-auto space-y-2">
                            {result.benefits && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                                  Benefits
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{result.benefits}</p>
                              </div>
                            )}

                            {result.suitable_for && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                                  Suitable for
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{result.suitable_for}</p>
                              </div>
                            )}

                            {result.ingredients && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                                  Key Ingredients
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{result.ingredients}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No results found. Try adjusting your search criteria.</p>
                  <button
                    onClick={() => setActiveTab("search")}
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
                  >
                    Back to Search
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} SkinWise. Find your perfect skincare match.</p>
          </div>
        </div>
      </div>

    </>
  )
}

export default SkinWise
