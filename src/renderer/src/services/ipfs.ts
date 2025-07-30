import axios from 'axios'

interface UploadToIpfsProps {
  file: Blob
  ipfsApiUrl: string
}

interface ReturnUploadToIpfsProps {
  success: boolean
  hash: string
}

export async function uploadToIpfs(props: UploadToIpfsProps): Promise<ReturnUploadToIpfsProps> {
  const { file, ipfsApiUrl } = props

  try {
    const response = await axios.postForm(`${ipfsApiUrl}/api/v0/add?pin=true`, {
      file
    })

    return {
      success: true,
      hash: response.data.Hash
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      hash: ''
    }
  }
}

export function base64ToBlob(base64String: string): Blob {
  const base64WithoutPrefix = base64String.split(';base64,').pop()
  const byteCharacters = atob(base64WithoutPrefix as string)
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i))
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: 'image/png' })
}
