import { type ActionFunctionArgs } from '@remix-run/node'
import { createThemeAction } from 'remix-themes'
import { themeSessionResolver } from '~/root'

export const themeAction = createThemeAction(themeSessionResolver)

export async function action(args: ActionFunctionArgs) {
  return themeAction(args)
}
