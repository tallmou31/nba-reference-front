import { Radio, Select, Table, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEntities } from '../redux/rank.reducer';
import { getEntities as getSeasons } from '../redux/season.reducer';

import { filterOption } from '../utils';
import { Link, useNavigate } from 'react-router-dom';

function StatPage() {
  const [filters, setFilters] = useState({
    unit: 'pts',
    size: 10,
    season: '',
  });
  const navigate = useNavigate();

  const entities = useSelector((state) => state.rank.entities);
  const loading = useSelector((state) => state.rank.loading);

  const seasons = useSelector((state) => state.season.entities);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSeasons());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEntities(filters));
  }, [dispatch, filters]);

  const getSeasonInterval = (seasons) => {
    if (!seasons) {
      return <></>;
    }
    const values = [...seasons];
    values.sort((a, b) => {
      return a.localeCompare(b);
    });
    return (
      <p className='italic text-center text-xs'>
        De <span className='font-bold'>{values[0]}</span> à{' '}
        <span className='font-bold'>{values[seasons.length - 1]}</span>
      </p>
    );
  };

  const columns = useMemo(() => {
    const getTitle = () => {
      switch (filters.unit) {
        case 'pts':
          return 'Total points';
        case 'ast':
          return 'Total passes';
        default:
          return 'Total rebonds';
      }
    };
    const result = [
      { title: 'N°', dataIndex: 'num', key: 'num' },
      {
        title: 'Nom du joueur',
        dataIndex: '_id',
        key: '_id',
        render: (_, item) => (
          <Link
            className='text-blue-500'
            onClick={() => {
              navigate({
                pathname: '/players/byName',
                search: `?${new URLSearchParams({
                  name: filters.season === '' ? item._id : item.player_name,
                  returnUrl: 'stats',
                })}`,
              });
            }}
          >
            {filters.season === '' ? item._id : item.player_name}
          </Link>
        ),
      },
      {
        title: getTitle(),
        dataIndex: 'total',
        key: 'total',
        render: (text) => Math.round(text),
      },
    ];

    if (filters.season === '') {
      result.push(
        {
          title: 'Nombre de saisons',
          dataIndex: 'nbseasons',
          key: 'nbseasons',
          render: (_, item) => (
            <p>
              <Tag color={'gold'}>{item.seasons?.length} saison(s)</Tag>{' '}
            </p>
          ),
        },
        {
          title: 'Nombre de saisons',
          dataIndex: 'seasons',
          key: 'seasons',
          render: (text) => getSeasonInterval(text),
        }
      );
    }
    return result;
  }, [filters.season, filters.unit, navigate]);

  return (
    <div>
      <div className='pt-3 mb-5 flex justify-between items-center'>
        <h1 className='font-bold text-xl'>Statistiques</h1>
        <div className='flex-1 flex justify-end gap-3'>
          <div className='flex gap-1 items-center'>
            <span>Taille page :</span>
            <Select
              style={{ width: 80 }}
              value={filters.size}
              onChange={(val) => setFilters((prev) => ({ ...prev, size: val }))}
              options={[
                ...[10, 20, 50, 100]?.map((r) => ({
                  label: r,
                  value: r,
                })),
              ]}
            />
          </div>
          <Select
            placeholder={'Selectionnez la saison'}
            showSearch
            style={{ width: 200 }}
            filterOption={filterOption}
            value={filters.season}
            onChange={(val) => setFilters((prev) => ({ ...prev, season: val }))}
            options={[
              { label: 'Toutes les saisons', value: '' },
              ...seasons?.map((r) => ({
                label: r,
                value: r,
              })),
            ]}
          />
        </div>
      </div>
      <div className='flex'>
        <Radio.Group
          value={filters.unit}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, unit: e.target.value }))
          }
        >
          <Radio.Button value='pts'>Points</Radio.Button>
          <Radio.Button value='ast'>Passes</Radio.Button>
          <Radio.Button value='reb'>Rebonds</Radio.Button>
        </Radio.Group>
      </div>
      <div>
        <Table
          loading={loading}
          dataSource={entities.map((e, num) => ({ ...e, num: num + 1 }))}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default StatPage;
