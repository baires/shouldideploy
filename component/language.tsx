import React from 'react';
import langs from '../helpers/languages';

interface ILanguage {
  onChange: (value: string) => void;
  language: string;
}

const Language = (props: ILanguage) => {
  /**
   * On change language propagate new language value
   * @return void
   */
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(event.target.value);
  };

  /**
   * Build options list
   * @return JSX.Element[]
   */
  const options = () => {
    return langs.map((lang) => {
      return (
        <option value={lang.key} key={lang.key}>
          {lang.value}
        </option>
      );
    });
  };

  /**
   * Render language selector
   * @return JSX.Element[]
   */
  return (
    <select value={props.language} onChange={onChange}>
      {options()}
    </select>
  );
};

export default Language