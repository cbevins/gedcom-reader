export class Place {
    constructor(text, parts, messages) {
        const standard = parts.join(',')
        const country = parts.length > 0 ? parts.pop() : ''
        const state = parts.length > 0 ? parts.pop() : ''
        const locale = parts.length > 0 ? parts.join(', ') : ''
        this._data = {
            count: 0,
            country: country,
            locale: locale,
            messages: messages,
            standard: standard,
            state: state,
            text: text
        }
    }

    count() { return this._data.count }
    country() { return this._data.country }
    standard() { return this._data.standard }
    locale() { return this._data.locale }
    messages() { return this._data.messages }
    state() { return this._data.state }
    text() { return this._data.text }

    increment() { this._data.count++ }
}
