import React from 'react'
import names from '../helpers/timezones'

interface ITimezone {
  onChange: (value: string) => void
  timezone: string
}

const Timezone = (props: ITimezone) => {
  /**
   * On change timezone propagate new timezone value
   * @return void
   */
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(event.target.value)
  }

  /**
   * Build options list
   * @return JSX.Element[]
   */
  const options = () => {
    return names.map((name, index) => {
      return (
        <option value={name} key={index}>
          {name}
        </option>
      )
    })
  }

  /**
   * Render timezone selector
   * @return JSX.Element[]
   */
  return (
    <select value={props.timezone} onChange={onChange}>
      {options()}
    </select>
  )
}

export default Timezone
