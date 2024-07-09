import { useEffect } from 'react'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Theme, useTheme } from 'remix-themes'
import { db } from '~/utils/db.server'

export async function loader() {
  return json({ count: await db.getCount() })
}

export async function action() {
  await db.increment()
  return redirect('/counter')
}

export default function Counter() {
  const data = useLoaderData<typeof loader>()
  const [theme, setTheme, { definedBy }] = useTheme()

  useEffect(() => {
    console.log({ theme, definedBy })
  }, [definedBy, theme])

  return (
    <div className="m-8">
      <p>Defined by: {definedBy}</p>
      <label className="mb-3 flex gap-3">
        Theme
        <select
          className="text-black"
          name="theme"
          value={definedBy === 'SYSTEM' ? '' : theme ?? ''}
          onChange={e => {
            const nextTheme = e.target.value

            if (nextTheme === '') {
              setTheme(null)
            } else {
              setTheme(nextTheme as Theme)
            }
          }}
        >
          <option value="">System</option>
          <option value={Theme.LIGHT}>Light</option>
          <option value={Theme.DARK}>Dark</option>
        </select>
      </label>
      <Form method="post">
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white"
          type="submit"
        >
          Count: {data.count}
        </button>
      </Form>
    </div>
  )
}
