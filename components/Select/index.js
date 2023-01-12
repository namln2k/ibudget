import Select from 'react-select';

export default function MySelect({ width, options, onChange }) {
  const defaultOption = options[0];

  const componentStyle = {
    control: (base) => ({
      ...base,
      fontFamily: 'Roboto',
      cursor: 'pointer',
      width: width
    }),
    menu: (base) => ({
      ...base,
      fontFamily: 'Roboto'
    })
  };

  return (
    <>
      <Select
        options={options}
        onChange={(value) => onChange(value)}
        defaultValue={defaultOption}
        styles={componentStyle}
        instanceId="select"
      />
    </>
  );
}
