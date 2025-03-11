import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-amber-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Comida Africana</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink to="/" className={({isActive}) => 
                isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
              }>
                Home
              </NavLink>
              <NavLink to="/menu" className={({isActive}) => 
                isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
              }>
                Menu
              </NavLink>
              <NavLink to="/about" className={({isActive}) => 
                isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
              }>
                About
              </NavLink>
              <NavLink to="/contact" className={({isActive}) => 
                isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
              }>
                Contact
              </NavLink>
              <NavLink to="/reviews" className={({isActive}) => 
                isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
              }>
                Reviews
              </NavLink>
              
              {isAdmin && (
                <NavLink to="/admin" className={({isActive}) => 
                  isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
                }>
                  Admin
                </NavLink>
              )}
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Cart */}
              <NavLink to="/cart" className="relative p-1 rounded-full hover:bg-amber-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {totalItems}
                  </span>
                )}
              </NavLink>
              
              {/* User Menu */}
              {isAuthenticated ? (
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-4">
                    <NavLink to="/orders" className={({isActive}) => 
                      isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
                    }>
                      My Orders
                    </NavLink>
                    <NavLink to="/profile" className={({isActive}) => 
                      isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
                    }>
                      {user?.name || 'Profile'}
                    </NavLink>
                    <button
                      onClick={logout}
                      className="px-3 py-2 rounded-md font-medium hover:bg-amber-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <NavLink to="/login" className={({isActive}) => 
                    isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
                  }>
                    Login
                  </NavLink>
                  <NavLink to="/register" className={({isActive}) => 
                    isActive ? "bg-amber-800 px-3 py-2 rounded-md font-medium" : "px-3 py-2 rounded-md font-medium hover:bg-amber-800"
                  }>
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-200 hover:text-white hover:bg-amber-800 focus:outline-none"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/"
            className={({isActive}) => 
              isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={({isActive}) => 
              isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
            }
            onClick={closeMenu}
          >
            Menu
          </NavLink>
          <NavLink
            to="/about"
            className={({isActive}) => 
              isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
            }
            onClick={closeMenu}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({isActive}) => 
              isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
            }
            onClick={closeMenu}
          >
            Contact
          </NavLink>
          <NavLink
            to="/reviews"
            className={({isActive}) => 
              isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
            }
            onClick={closeMenu}
          >
            Reviews
          </NavLink>
          <NavLink
            to="/cart"
            className={({isActive}) => 
              isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
            }
            onClick={closeMenu}
          >
            Cart {totalItems > 0 && `(${totalItems})`}
          </NavLink>
          
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({isActive}) => 
                isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
              }
              onClick={closeMenu}
            >
              Admin
            </NavLink>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-amber-800">
          {isAuthenticated ? (
            <div className="px-2 space-y-1">
              <NavLink
                to="/orders"
                className={({isActive}) => 
                  isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
                }
                onClick={closeMenu}
              >
                My Orders
              </NavLink>
              <NavLink
                to="/profile"
                className={({isActive}) => 
                  isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
                }
                onClick={closeMenu}
              >
                {user?.name || 'Profile'}
              </NavLink>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <NavLink
                to="/login"
                className={({isActive}) => 
                  isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
                }
                onClick={closeMenu}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({isActive}) => 
                  isActive ? "block px-3 py-2 rounded-md text-base font-medium bg-amber-800" : "block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
                }
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;