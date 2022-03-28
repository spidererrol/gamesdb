/**
 * @property key Unique value for this item.
 * @property display content for item
 */

import { Key } from "react"

export interface CloudItem {
    key: Key
    display: string | JSX.Element
}
