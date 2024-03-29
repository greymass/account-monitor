import * as pkg from './index'
const MockData = {}
for (const key of Object.keys(pkg)) {
    if (key === 'default') continue
    MockData[key] = pkg[key]
}
export default MockData
