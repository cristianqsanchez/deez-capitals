import { CONTINENTS } from './consts/continents'

import type { Country } from './types/country'
import { equals } from './utils/collator'

import { countries } from './assets/capitals.json'

import { intro, text, cancel, log, isCancel, multiselect } from '@clack/prompts'

let streak = 0

main()

async function main() {
    intro('🌍 Bienvenido a Deez Capitals! Pon a prueba tus conocimientos de capitales del mundo.')
    const continents = await selectContinents()
    const countries = filterCountries(continents)
    await gameLoop(countries)
}

async function gameLoop(countries: Country[]) {
    let availableCountries = [...countries]

    while (availableCountries.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCountries.length)
        const country = availableCountries[randomIndex]!
        const userAnswer = await askQuestion(country)
        await checkAnswer(userAnswer, country)
        availableCountries.splice(randomIndex, 1)
    }

    log.info('🎉 ¡Has jugado con todos los países seleccionados! Buen trabajo.')
}

async function selectContinents(): Promise<string[]> {
    const selectedContinents = await multiselect({
        message: '👉 ¿Con qué continentes quieres jugar?',
        options: Object.values(CONTINENTS).map(continent => ({
            value: continent,
            label: continent,
        })),
        initialValues: Object.values(CONTINENTS)
    })


    if (isCancel(selectedContinents)) {
        cancel('❌ Juego cancelado. ¡Nos vemos la próxima vez! 👋')
        process.exit(0)
    }

    return selectedContinents
}

function filterCountries(selectedContinents: string[]): Country[] {
    return countries.filter(c => selectedContinents.includes(c.continent_es))
}

async function askQuestion(country: Country): Promise<string> {
    let userAnswer = await text({
        message: `¿Cuál es la capital de ${country.name_es}? (🔥 racha: ${streak})`,
        defaultValue: '',
        initialValue: '',
        placeholder: 'Escribe tu respuesta...',
    })

    if (isCancel(userAnswer)) {
        cancel('👋 Hasta pronto, viajero de capitales.')
        process.exit(0)
    }

    return userAnswer
}

async function checkAnswer(userAnswer: string, country: Country): Promise<boolean> {
    if (!equals(userAnswer, country.capital_es)) {
        log.error(`❌ Ups, fallaste. La respuesta correcta era: ${country.capital_es} 🏙️`)
        streak = 0
        return false
    }

    log.success(`✅ ¡Correcto! ${country.capital_es} es la capital de ${country.name_es}.`)
    streak++
    return true
}
