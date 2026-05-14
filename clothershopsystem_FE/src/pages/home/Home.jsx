import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../../components/Hero'
import Categories from '../../components/Categories'
import Products from '../../components/Products'
import { fetchCategories, fetchProducts } from './service'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      const cats = await fetchCategories()
      setCategories(cats)
      const prods = await fetchProducts()
      setProducts(prods)
    }
    loadData()
  }, [])

  return (
    <>
      <Hero />
      <Categories categories={categories} />
      <Products products={products} onViewDetail={(id) => navigate(`/detail/${id}`)} />
    </>
  )
}