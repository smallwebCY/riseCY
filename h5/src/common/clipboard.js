import { Toast } from 'vant';
import Clipboard from 'clipboard'
function clipboardSuccess() {
  Toast({
    type: 'success',
    message: 'Sao chép của tôi',
    duration: 1500
  })
}

function clipboardError() {
  Toast({
    type: 'fail',
    message: 'Sao chép thất bại'
  })
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
