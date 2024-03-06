import React, { useState, useEffect } from "react"
import {
  useExperiment as growthbookUseExperiment
} from '@growthbook/growthbook-react'


export default function useExperiment(experiment) {
    const [experimentVersion, setExperimentVersion] = useState();
    const { key, variations } = experiment
  
    if (typeof window === 'undefined') {
      return {
        value: null,
        isControl: false,
        isVariation: false,
        isVariant: () => false
      }
    }
  
    const params = new URLSearchParams(window.location.search)
    const version = params.get(`gb-${key}`)
    const data = { key, variations }
  
    if (version) {
      data.force = version ? variations.indexOf(version) : 0
    }
  
    const { value } = growthbookUseExperiment(data)
  
    useEffect(() => {
      const cachedVersion = localStorage.getItem(`growthbook_experiment_${key}`)
  
      if (typeof data.force !== 'undefined') {
        setExperimentVersion(variations[data.force])
        return
      }
  
      if (cachedVersion) {
        setExperimentVersion(variations[cachedVersion])
        return
      }
  
      if (value) {
        setExperimentVersion(value)
        return
      }
    }, [variations, value, data.force])
  
    return {
      value: experimentVersion,
      isControl: experimentVersion === variations[0],
      isVariation: experimentVersion !== variations[0],
      isVariant: (variant) => experimentVersion === variant
    }
  }