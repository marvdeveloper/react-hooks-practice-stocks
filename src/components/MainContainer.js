import React, { useState, useEffect } from "react";
import StockContainer from "./StockContainer";
import PortfolioContainer from "./PortfolioContainer";
import SearchBar from "./SearchBar";

function MainContainer() {
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [sortType, setSortType] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Fetch stocks once when component mounts
  useEffect(() => {
    fetch("http://localhost:3001/stocks")
      .then((res) => res.json())
      .then((data) => setStocks(data));
  }, []);

  // Buy a stock (add to portfolio)
  const handleBuyStock = (stock) => {
    if (!portfolio.find((s) => s.id === stock.id)) {
      setPortfolio([...portfolio, stock]);
    }
  };

  // Sell a stock (remove from portfolio)
  const handleSellStock = (stock) => {
    setPortfolio(portfolio.filter((s) => s.id !== stock.id));
  };

  // Handle sorting logic
  const handleSortChange = (type) => {
    setSortType(type);
  };

  // Handle filtering logic
  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  // Apply sorting and filtering
  const getFilteredStocks = () => {
    let filtered = [...stocks];

    if (filterType !== "All") {
      filtered = filtered.filter((stock) => stock.type === filterType);
    }

    if (sortType === "Alphabetically") {
      filtered.sort((a, b) => a.ticker.localeCompare(b.ticker));
    } else if (sortType === "Price") {
      filtered.sort((a, b) => a.price - b.price);
    }

    return filtered;
  };

  return (
    <div>
      <SearchBar
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />
      <div className="row">
        <div className="col-8">
          <StockContainer stocks={getFilteredStocks()} onBuyStock={handleBuyStock} />
        </div>
        <div className="col-4">
          <PortfolioContainer portfolio={portfolio} onSellStock={handleSellStock} />
        </div>
      </div>
    </div>
  );
}

export default MainContainer;
