import { createContext, useReducer, useEffect } from "react";

export const ItemsContext = createContext();

const initialState = {
  items: [],
  loading: true,
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'GET_ITEMS_START':
      return { ...state, loading: true, error: '' };
    case 'GET_ITEMS_SUCCESS':
      return { ...state, items: action.payload, loading: false };
    case 'GET_ITEMS_ERROR':
      return { ...state, items: [], loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ItemsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchItems = async () => {
    dispatch({ type: 'GET_ITEMS_START' });
    try {
      const response = await fetch('http://localhost:5000/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      dispatch({ type: 'GET_ITEMS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'GET_ITEMS_ERROR', payload: error.message });
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ items: state.items, loading: state.loading, error: state.error }}>
      {children}
    </ItemsContext.Provider>
  );
};

export default ItemsContext;
