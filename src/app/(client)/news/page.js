"use client"; // This line marks this component as a Client Component

import { useState, useEffect } from 'react';
import axios from 'axios';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchNewsFromSources = async () => {
    setLoading(true);
    try {
      // Calculate dates for the last 3 days
      const endDate = new Date();
      const startDate = new Date(endDate - 3 * 24 * 60 * 60 * 1000); // 3 days ago

      const newsFromApi = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: "finance AND (India OR Indian)",
          apiKey: "e5e428d182c34d8087eb8698d7c2c1c7",
          language: "en",
          pageSize: 50, // Increased to get more results from 3 days
          sortBy: "publishedAt",
          from: startDate.toISOString(),
          to: endDate.toISOString(),
          domains: "economictimes.indiatimes.com,moneycontrol.com,livemint.com,business-standard.com,financialexpress.com,ndtv.com/business,thehindu.com/business,businesstoday.in,zeebiz.com,businessinsider.in"
        },
      });

      // Fetching data from AlphaVantage with India-specific filtering
      const alphaVantageFinanceData = await axios.get("https://www.alphavantage.co/query", {
        params: {
          function: "NEWS_SENTIMENT",
          topics: "finance",
          tickers: "NSEI,BSESN", // Adding Indian market indices (Nifty 50 and Sensex)
          apiKey: "SV3CFSVD28SQ94N9",
        },
      });

      // Combine and filter for strictly Indian finance-related news
      const allNews = [
        ...newsFromApi.data.articles || [],
        ...alphaVantageFinanceData.data.feed || [],
      ];

      // More strict filtering for Indian finance-related content
      const filteredNews = allNews.filter(article => {
        const title = article.title.toLowerCase();
        const description = article.description?.toLowerCase() || '';
        
        // Keywords specific to Indian finance
        const indianFinanceKeywords = [
          'india',
          'indian',
          'nifty',
          'sensex',
          'rbi',
          'rupee',
          'sebi',
          'bse',
          'nse',
          'mumbai',
          'dalal street'
        ];

        const financeKeywords = [
          'finance',
          'stock',
          'market',
          'investment',
          'trading',
          'economy',
          'financial',
          'bank'
        ];

        // Article must contain both an Indian keyword AND a finance keyword
        return indianFinanceKeywords.some(indiaWord => 
          title.includes(indiaWord) || description.includes(indiaWord)
        ) && financeKeywords.some(financeWord => 
          title.includes(financeWord) || description.includes(financeWord)
        );
      });

      setLastUpdated(new Date());
      setNews(filteredNews);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news.");
      setLoading(false);
    }
  };

  // Add auto-refresh every 5 minutes
  useEffect(() => {
    fetchNewsFromSources(); // Initial fetch

    const refreshInterval = setInterval(() => {
      fetchNewsFromSources();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(refreshInterval); // Cleanup on unmount
  }, []);

  // Add manual refresh function
  const handleRefresh = () => {
    fetchNewsFromSources();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="header-section">
        <h1>Latest Finance News</h1>
        <div className="refresh-section">
          <button 
            onClick={handleRefresh}
            className="refresh-button"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh News'}
          </button>
          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="news-cards-container">
        {news.length === 0 ? (
          <div>No finance news available at the moment.</div>
        ) : (
          news.map((article, index) => (
            <div key={index} className="news-card">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .news-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .news-card {
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s;
        }

        .news-card:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .news-card h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .news-card p {
          font-size: 14px;
          margin-bottom: 10px;
        }

        .news-card a {
          font-size: 14px;
          color: #0070f3;
          text-decoration: none;
        }

        .news-card a:hover {
          text-decoration: underline;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .refresh-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .refresh-button {
          padding: 8px 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .refresh-button:hover {
          background-color: #0051b3;
        }

        .refresh-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .last-updated {
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default NewsPage;
