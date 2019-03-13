import React from 'react';
import PropTypes from 'prop-types';

const FilterData = ({ WOs, onSelectFilter }) => {
  const filteredData = WOs.filter(
    datas =>
      datas.approved_by_spv === false && datas.approved_by_manager === false,
    datas =>
      datas.approved_by_spv === true && datas.approved_by_manager === true,
    datas => datas.done === true
  );

  return <select onChange={(e) => onSelectFilter(e.target.value)}>
        {
            filteredData.map(datas => {
                const {code, name} = currency;
                return <option key={code} value={code}>{name}</option>
            })
        }
    </select>
}

SelectCurrency.propTypes = {
  currencies: PropTypes.array.isRequired,
  onSelectCurrency: PropTypes.func.isRequired
};

<option value={0}>All</option>
          <option value={1}>Pending Approval</option>
          <option value={2}>On Progress</option>
          <option value={3}>Done</option>