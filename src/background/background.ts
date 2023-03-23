chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    console.log(message)
  })
  port.onDisconnect.addListener((port) => {
    console.log("stupid tab disconnected")
  })
})
