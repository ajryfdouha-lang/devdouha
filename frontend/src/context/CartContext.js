import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const panierKey = user ? `panier_${user.id}` : 'panier_guest'

  const [panier, setPanier] = useState([])

  // ✅ Charger le panier quand l'utilisateur change
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(panierKey) || '[]')
    setPanier(data)
  }, [panierKey])

  // ✅ Sauvegarder à chaque modification
  useEffect(() => {
    localStorage.setItem(panierKey, JSON.stringify(panier))
  }, [panier, panierKey])

  const ajouterAuPanier = (produit, ml) => {
    setPanier(prev => {
      const existe = prev.find(i => i.id === produit.id && i.ml === ml)
      const prix = produit[`prix_${ml}`]
                || produit[`prix${ml}`]
                || produit.prix_30ml
                || 0
      if (existe) {
        return prev.map(i =>
          i.id === produit.id && i.ml === ml
            ? { ...i, quantite: i.quantite + 1 }
            : i
        )
      }
      return [...prev, { ...produit, ml, prix, quantite: 1 }]
    })
  }

  const supprimerDuPanier = (id, ml) => {
    setPanier(prev => prev.filter(i => !(i.id === id && i.ml === ml)))
  }

  const changerQuantite = (id, ml, quantite) => {
    if (quantite < 1) return supprimerDuPanier(id, ml)
    setPanier(prev => prev.map(i =>
      i.id === id && i.ml === ml ? { ...i, quantite } : i
    ))
  }

  // ✅ Vider le panier du localStorage aussi
  const viderPanier = () => {
    setPanier([])
    localStorage.removeItem(panierKey)
  }

  const total      = panier.reduce((acc, i) => acc + (i.prix || 0) * i.quantite, 0)
  const nbArticles = panier.reduce((acc, i) => acc + i.quantite, 0)

  return (
    <CartContext.Provider value={{
      panier, ajouterAuPanier, supprimerDuPanier,
      changerQuantite, viderPanier, total, nbArticles
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)