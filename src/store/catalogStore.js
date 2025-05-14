import { ref } from 'vue'
import axios from 'axios'

// State
const catalog = ref({})
const isLoaded = ref(false)
const isLoading = ref(false)
const error = ref(null)

// Helper function to get catalog URL based on environment
const getCatalogUrl = () => {
  const isDevelopment = import.meta.env.MODE === 'development'
  if (isDevelopment) {
    return '/catalog.json'
  } else {
    return 'https://raw.githubusercontent.com/lab240/napi-catalog/refs/heads/main/catalog.json'
  }
}

// Actions
const fetchCatalog = async () => {
  // Return early if already loaded or currently loading
  if (isLoaded.value || isLoading.value) return catalog.value

  isLoading.value = true
  error.value = null

  try {
    const response = await axios.get(getCatalogUrl())
    catalog.value = response.data
    isLoaded.value = true
    return catalog.value
  } catch (err) {
    console.error('Error fetching catalog data:', err)
    error.value = err
    return {}
  } finally {
    isLoading.value = false
  }
}

// Get a specific sensor by model
const getSensor = (model) => {
  if (!isLoaded.value) {
    console.warn('Catalog not loaded yet, call fetchCatalog first')
    return null
  }

  for (const brand in catalog.value) {
    if (catalog.value[brand].meta) {
      for (const modelKey in catalog.value[brand]) {
        if (
          catalog.value[brand][modelKey].meta &&
          catalog.value[brand][modelKey].meta.model === model
        ) {
          return {
            brandData: catalog.value[brand],
            modelData: catalog.value[brand][modelKey]
          }
        }
      }
    }
  }

  return null
}

// Get all sensors for listing
const getAllSensors = () => {
  if (!isLoaded.value) {
    console.warn('Catalog not loaded yet, call fetchCatalog first')
    return []
  }

  const sensorsArray = []

  for (const brand in catalog.value) {
    if (catalog.value[brand].meta) {
      for (const model in catalog.value[brand]) {
        if (model !== 'meta' && catalog.value[brand][model].meta) {
          sensorsArray.push({
            brand: catalog.value[brand].meta.vendor || brand,
            model: catalog.value[brand][model].meta.model,
            tags: catalog.value[brand][model].meta.tags || []
          })
        }
      }
    }
  }

  return sensorsArray
}

export default {
  catalog,
  isLoaded,
  isLoading,
  error,
  fetchCatalog,
  getSensor,
  getAllSensors
}
