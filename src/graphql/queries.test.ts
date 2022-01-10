import { getAllImages } from './queries'
import { ImagesSelectionResult } from './results'
import * as db from '../db/db'

describe('graphql queries', () => {
    describe('fetching all images', () => {
        it('fetch by undefined user id', async () => {
            const imagesResult = await getAllImages(undefined)
            expect(imagesResult).toEqual(ImagesSelectionResult.getUnauthorizedResult())
            expect(imagesResult.images.length).toBe(0)
        })
        it('fetch by defined userId', async () => {
            const spy = jest.spyOn(db, 'getAllImages').mockImplementation(() => new Promise((resolve, reject) => {
                setTimeout(() => resolve([]), 0)
            }))

            const imagesResult = await getAllImages('123')
            expect(imagesResult).not.toEqual(ImagesSelectionResult.getUnauthorizedResult())
        })
    })
})