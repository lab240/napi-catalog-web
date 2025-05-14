import { ref, type Ref } from 'vue'
import axios from 'axios'

// Interfaces
export interface MetaData {
  vendor?: string
  model?: string
  tags?: string[]
  [key: string]: string | number | boolean | string[] | undefined
}

export interface ModelData {
  meta: MetaData
  [key: string]: unknown
}

export interface BrandData {
  meta: MetaData
  [key: string]: ModelData | MetaData
}

export interface CatalogData {
  [brand: string]: BrandData
}

export interface SensorResult {
  brandData: BrandData
  modelData: ModelData
}

export interface SensorListItem {
  brand: string
  model: string
  tags: string[]
}

// State
const catalog: Ref<CatalogData> = ref({})
const isLoaded: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const error: Ref<Error | null> = ref(null)

// Helper function to get catalog URL based on environment
const getCatalogUrl = (): string => {
  const isDevelopment = import.meta.env.MODE === 'development'
  if (isDevelopment) {
    return '/catalog.json'
  } else {
    return 'https://raw.githubusercontent.com/lab240/napi-catalog/refs/heads/main/catalog.json'
  }
}

// Actions
const fetchCatalog = async (): Promise<CatalogData> => {
  // Return early if already loaded or currently loading
  if (isLoaded.value || isLoading.value) return catalog.value

  isLoading.value = true
  error.value = null

  try {
    const response = await axios.get<CatalogData>(getCatalogUrl())
    catalog.value = response.data
    isLoaded.value = true
    return catalog.value
  } catch (err) {
    console.error('Error fetching catalog data:', err)
    error.value = err instanceof Error ? err : new Error(String(err))
    return {}
  } finally {
    isLoading.value = false
  }
}

// Get a specific sensor by model
const getSensor = (model: string): SensorResult | null => {
  if (!isLoaded.value) {
    console.warn('Catalog not loaded yet, call fetchCatalog first')
    return null
  }

  for (const brand in catalog.value) {
    if (catalog.value[brand].meta) {
      for (const modelKey in catalog.value[brand]) {
        if (
          modelKey !== 'meta' &&
          catalog.value[brand][modelKey] &&
          'meta' in catalog.value[brand][modelKey] &&
          (catalog.value[brand][modelKey] as ModelData).meta.model === model
        ) {
          return {
            brandData: catalog.value[brand],
            modelData: catalog.value[brand][modelKey] as ModelData,
          }
        }
      }
    }
  }

  return null
}

// Get all sensors for listing
const getAllSensors = (): SensorListItem[] => {
  if (!isLoaded.value) {
    console.warn('Catalog not loaded yet, call fetchCatalog first')
    return []
  }

  const sensorsArray: SensorListItem[] = []

  for (const brand in catalog.value) {
    if (catalog.value[brand].meta) {
      for (const model in catalog.value[brand]) {
        if (
          model !== 'meta' &&
          catalog.value[brand][model] &&
          'meta' in catalog.value[brand][model]
        ) {
          const modelData = catalog.value[brand][model] as ModelData
          sensorsArray.push({
            brand: catalog.value[brand].meta.vendor || brand,
            model: modelData.meta.model || '',
            tags: modelData.meta.tags || [],
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
  getAllSensors,
}
