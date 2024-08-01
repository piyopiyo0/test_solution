/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useMemo } from 'react';
import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );
  const owner = usersFromServer.find(user => user.id === product.ownerId);

  return {
    ...product,
    category,
    owner,
  };
});

export const App = () => {
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedOwner) {
      filtered = filtered.filter(product => product.owner.id === selectedOwner);
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category.id),
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.direction === 'ascending') {
          return aValue > bValue ? 1 : -1;
        }

        if (sortConfig.direction === 'descending') {
          return aValue < bValue ? 1 : -1;
        }

        return 0;
      });
    }

    return filtered;
  }, [selectedOwner, selectedCategories, searchTerm, sortConfig]);

  const handleOwnerFilter = owner => {
    setSelectedOwner(owner);
  };

  const handleCategoryFilter = category => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(cat => cat !== category)
        : [...prevCategories, category],
    );
  };

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const resetFilters = () => {
    setSelectedOwner('');
    setSelectedCategories([]);
    setSearchTerm('');
    setSortConfig({ key: '', direction: '' });
  };

  const handleSort = key => {
    let direction = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === 'descending'
    ) {
      direction = '';
    }

    setSortConfig({ key, direction });
  };

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
                className={!selectedOwner ? 'is-active' : ''}
                onClick={() => handleOwnerFilter('')}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  className={selectedOwner === user.id ? 'is-active' : ''}
                  href="#/"
                  onClick={() => handleOwnerFilter(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <input
                type="text"
                className="input"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="button is-small is-danger"
                  onClick={clearSearch}
                >
                  X
                </button>
              )}
            </div>

            <div className="panel-block">
              <div className="buttons">
                {categoriesFromServer.map(category => (
                  <button
                    type="button"
                    key={category.id}
                    className={`button ${
                      selectedCategories.includes(category.id) ? 'is-info' : ''
                    }`}
                    onClick={() => handleCategoryFilter(category.id)}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
                <button
                  type="button"
                  className="button"
                  onClick={() => setSelectedCategories([])}
                >
                  All
                </button>
              </div>
            </div>

            <div className="panel-block">
              <button
                type="button"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </button>
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
                  <th onClick={() => handleSort('id')}>
                    ID{' '}
                    {sortConfig.key === 'id' &&
                      (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('name')}>
                    Name{' '}
                    {sortConfig.key === 'name' &&
                      (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('category.name')}>
                    Category{' '}
                    {sortConfig.key === 'category.name' &&
                      (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('owner.name')}>
                    Owner{' '}
                    {sortConfig.key === 'owner.name' &&
                      (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>
                      {product.category.icon}
                      {product.category.name}
                    </td>
                    <td
                      className={
                        product.owner.gender === 'male'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.owner.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
