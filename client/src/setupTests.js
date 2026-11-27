// Ajoute des vérifications pratiques aux tests, comme toBeInTheDocument()
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vide l'écran simulé après chaque test, pour que les tests ne se mélangent pas
afterEach(() => cleanup())
