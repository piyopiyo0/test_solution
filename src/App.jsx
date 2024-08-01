/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [products] = useState(productsFromServer);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleResetAll = () => {
    setSelectedUserId(null);
    setSearchQuery('');
    setSelectedCategory([]);
  };

  const handleUserChange = userId => {
    setSelectedUserId(userId);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCategoryChange = categoryId => {
    setSelectedCategory(prevCat =>
      prevCat.includes(categoryId)
        ? prevCat.filter(id => id !== categoryId)
        : [...prevCat, categoryId],
    );
  };

  const filteredProducts = products.filter(product => {
    const category = categoriesFromServer.find(
      cat => cat.id === product.categoryId,
    );
    const owner = usersFromServer.find(user => user.id === category.ownerId);

    const matchUser = !selectedUserId || (owner && owner.id === selectedUserId);

    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory.length === 0 ||
      selectedCategory.includes(product.categoryId);

    return matchUser && matchSearch && matchCategory;
  });

  const renderProducts = filteredProducts.map(product => {
    const category = categoriesFromServer.find(
      item => item.id === product.categoryId,
    );
    const owner = usersFromServer.find(user => user.id === category.ownerId);

    return (
      <tr key={product.id} data-cy="Product">
        <td className="has-text-weight-bold" data-cy="ProductId">
          {product.id}
        </td>
        <td data-cy="ProductName">{product.name}</td>
        <td data-cy="ProductCategory">
          {category.icon} - {category.title}
        </td>
        <td
          data-cy="ProductUser"
          className={owner.sex === 'm' ? 'has-text-link' : 'has-text-danger'}
        >
          {owner.name}
        </td>
      </tr>
    );
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={!selectedUserId ? 'is-active' : ''}
                onClick={() => handleUserChange(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={() => handleUserChange(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchQuery && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearSearch}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${selectedCategory.length === 0 ? 'is-outlined' : ''}`}
                onClick={() => setSelectedCategory([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategory.includes(category.id) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>{renderProducts}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
