class MonitLogger {
  constructor() {}

  info(...args) {
    console.log(
      '%cINFO',
      'background: #16a34a; color: #fff; font-weight: 600; padding: 2px 4px;',
      ...args
    )
  }

  warn(...args) {
    console.log(
      '%cWARN',
      'background: #eab308; color: #fff; font-weight: 600; padding: 2px 4px;',
      ...args
    )
  }

  error(...args) {
    console.log(
      '%cERROR',
      'background: #dc2626; color: #fff; font-weight: 600; padding: 2px 4px;',
      ...args
    )
  }
}

class MonitHttpClient {
  constructor(url) {
    this.url = url
  }

  dispatchLoadEvent(payload) {
    return fetch(this.url + '/events/load', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  dispatchFetchEvent(payload) {
    return fetch(this.url + '/events/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  dispatchPageViewEvent(payload) {
    return fetch(this.url + '/events/view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  dispatchErrorEvent(payload) {
    return fetch(this.url + '/events/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  dispatchVisibilityEvent(payload) {
    return fetch(this.url + '/events/visibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }
}

class Monit {
  static kUserId = '@monit:user-id'
  static kDeviceId = '@monit:device-id'

  constructor({ serverUrl = 'http://localhost:3333', debug = false } = {}) {
    this.debug = debug
    this.serverUrl = serverUrl

    this.http = new MonitHttpClient(serverUrl)
    this.logger = new MonitLogger()

    this.startupTime = Date.now()
    this.user = this.getUser()
    this.device = this.getDevice()
    this.website = this.getWebsite()
  }

  getWebsite() {
    const website = {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
    }

    return website
  }

  getDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const name = isMobile
      ? navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)[0]
      : 'desktop'

    const isKnownBrowser = /Chrome|Safari|Firefox|MSIE|Trident/i.test(
      navigator.userAgent
    )

    return {
      type: isMobile ? 'mobile' : 'desktop',
      name: name,
      width: window.innerWidth,
      height: window.innerHeight,
      browser: isKnownBrowser
        ? navigator.userAgent.match(/Chrome|Safari|Firefox|MSIE|Trident/i)[0]
        : 'unknown',
    }
  }

  getUser() {
    return {
      userId: this.getUserId(),
      deviceId: this.getDeviceId(),
    }
  }

  getDeviceId() {
    if (localStorage.getItem(Monit.kDeviceId)) {
      return localStorage.getItem(Monit.kDeviceId)
    }

    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)

    localStorage.setItem(Monit.kDeviceId, id)

    return id
  }

  getUserId() {
    if (localStorage.getItem(Monit.kUserId)) {
      return localStorage.getItem(Monit.kUserId)
    }

    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)

    localStorage.setItem(Monit.kUserId, id)

    return id
  }

  configure() {
    this.#configureLoad()
    this.#configureFetch()
    this.#configureError()
    this.#configureVisibility()
    this.#configureNetworkStatus()
    this.#initialize()
  }

  #initialize() {
    const payload = {
      user: this.user,
      device: this.device,
      website: this.website,
    }

    this.http.dispatchPageViewEvent(payload)
  }

  #configureFetch() {
    const originalFetch = window.fetch

    window.fetch = (...args) => {
      if (typeof args[0] === 'string') {
        if (args[0].includes(this.serverUrl)) {
          return originalFetch(...args)
        }
      }

      return originalFetch(...args).then((res) => {
        const payload = {
          user: this.user,
          device: this.device,
          website: this.website,
          time: Date.now() - this.startupTime,
          url: res.url,
          method: args[1]?.method || 'GET',
          status: res.status,
        }

        if (this.debug) {
          this.logger.info('Dispatching fetch event')
        }

        this.http.dispatchFetchEvent(payload)

        return res
      })
    }
  }

  #configureError() {
    window.addEventListener('error', (event) => {
      const payload = {
        user: this.user,
        device: this.device,
        website: this.website,
        message: event.message,
        filename: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
      }

      if (this.debug) {
        this.logger.error('Error event was dispatched on window, info:', {
          message: event.message,
          filename: event.filename,
          lineNumber: event.lineno,
          columnNumber: event.colno,
        })

        this.logger.info('Dispatching error event')
      }
      this.http.dispatchErrorEvent(payload)
    })
  }

  #configureVisibility() {
    let time = Date.now()

    window.addEventListener('visibilitychange', () => {
      const payload = {
        user: this.user,
        device: this.device,
        website: this.website,
        state: document.visibilityState,
        screenTime: Date.now() - time,
      }

      if (this.debug) {
        this.logger.info('Dispatching visibility event')
      }

      time = Date.now()

      this.http.dispatchVisibilityEvent(payload)
    })

    window.addEventListener('beforeunload', () => {
      const payload = {
        user: this.user,
        device: this.device,
        website: this.website,
        visibility: {
          state: document.visibilityState,
          screenTime: Date.now() - time,
        },
      }

      this.http.dispatchVisibilityEvent(payload)
    })
  }

  #configureNetworkStatus() {
    window.addEventListener('online', () => {
      const payload = {
        user: this.user,
        device: this.device,
        website: this.website,
        network: {
          status: 'online',
        },
      }

      if (this.debug) {
        this.logger.info('Dispatching network event')
        this.logger.warn('User is back online')
      }

      this.http.dispatchNetworkEvent(payload)
    })

    window.addEventListener('offline', () => {
      const payload = {
        user: this.user,
        device: this.device,
        website: this.website,
        network: {
          status: 'offline',
        },
      }

      if (this.debug) {
        this.logger.info('Dispatching network event')
        this.logger.warn('User is now offline')
      }

      this.http.dispatchNetworkEvent(payload)
    })
  }

  #configureLoad() {
    window.addEventListener('load', () => {
      const payload = {
        user: this.user,
        device: this.device,
        website: this.website,
        time: Date.now() - this.startupTime,
      }

      if (this.debug) {
        this.logger.info('Dispatching load event')

        if (Date.now() - this.startupTime > 1000) {
          this.logger.warn(
            'Page took more than 1 second to load, consider optimizing.'
          )
        }
      }

      this.http.dispatchLoadEvent(payload)
    })
  }
}

const monitor = new Monit({
  debug: true,
})

monitor.configure()

setInterval(() => {
  throw new Error('Fuck fuck fuck!')
}, 5_000)

setInterval(() => {
  window.location.reload()
}, 10_000)
