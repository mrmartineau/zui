import { showToast, Toast } from '@raycast/api'
import { fetchReferenceData } from './reference'

export default async function UpdateData() {
  const toast = await showToast({
    style: Toast.Style.Animated,
    title: 'Checking for ZUI data updates…',
  })
  try {
    const { data, updated } = await fetchReferenceData()
    toast.style = Toast.Style.Success
    toast.title = updated
      ? `Updated to ZUI v${data.zuiVersion}`
      : 'Already up to date'
    toast.message = `${data.classes.length} classes · ${data.tokens.length} tokens · ${data.snippets.length} snippets`
  } catch (error) {
    toast.style = Toast.Style.Failure
    toast.title = 'Could not update ZUI data'
    toast.message = error instanceof Error ? error.message : String(error)
  }
}
