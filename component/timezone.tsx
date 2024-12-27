import React from 'react'

interface ITimezone {
  onChange: (value: string) => void
  timezone: string
}

const Timezone = (props: ITimezone) => {
  /**
   * Get local timezone using Intl API
   * @return string
   */
  const getLocalTimezone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  /**
   * On change timezone propagate new timezone value
   * @return void
   */
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(event.target.value)
  }

  return (
    <select
      value={props.timezone || getLocalTimezone()}
      onChange={onChange}
    >
      <option value={getLocalTimezone()}>
        {getLocalTimezone()} (Local)
      </option>
    </select>
  )
}

export default Timezone
