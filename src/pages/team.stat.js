import { Button, Select, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getEntities } from '../redux/team.stats.reducer';
import { LeftCircleOutlined } from '@ant-design/icons';
import { filterOption } from '../utils';
import { getEntities as getSeasons } from '../redux/season.reducer';

function TeamStatPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    season: '2020-21',
  });

  const entities = useSelector((state) => state.teamStats.entities);
  const loading = useSelector((state) => state.teamStats.loading);
  const [name, setName] = useState('');
  const seasons = useSelector((state) => state.season.entities);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSeasons());
  }, [dispatch]);

  useEffect(() => {
    const name = searchParams.get('name');
    setName(name);
    dispatch(getEntities({ team: name, season: filters.season }));
  }, [dispatch, filters.season, searchParams]);

  const columns = useMemo(() => {
    const result = [
      {
        title: 'Nom du joueur',
        dataIndex: 'player_name',
        key: 'player_name',
        render: (text) => (
          <Link
            className='text-blue-500'
            onClick={() => {
              navigate({
                pathname: '/players/byName',
                search: `?${new URLSearchParams({
                  name: text,
                  returnUrl: name,
                })}`,
              });
            }}
          >
            {text}
          </Link>
        ),
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'MJ',
        dataIndex: 'gp',
        key: 'gp',
      },
      {
        title: 'PTS',
        dataIndex: 'pts',
        key: 'pts',
      },
      {
        title: 'AST',
        dataIndex: 'ast',
        key: 'ast',
      },
      {
        title: 'REB',
        dataIndex: 'reb',
        key: 'reb',
      },
      {
        title: 'Taille',
        dataIndex: 'player_height',
        key: 'player_height',
      },
      {
        title: 'Poids',
        dataIndex: 'player_weight',
        key: 'player_weight',
        render: (text) => Math.round(text),
      },

      {
        title: 'Collège',
        dataIndex: 'college',
        key: 'college',
      },
      {
        title: 'Pays',
        dataIndex: 'country',
        key: 'country',
      },
      {
        title: 'Année Draft',
        dataIndex: 'draft_year',
        key: 'draft_year',
      },
      {
        title: 'Tour Draft',
        dataIndex: 'draft_round',
        key: 'draft_round',
      },
      {
        title: 'N° Draft',
        dataIndex: 'draft_number',
        key: 'draft_number',
      },
    ];

    return result;
  }, [name, navigate]);

  return (
    <div>
      <div className='pt-3 mb-5 flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Button
            type='text'
            title='Retour'
            onClick={() => {
              navigate({
                pathname: '/teams',
              });
            }}
            icon={<LeftCircleOutlined style={{ fontSize: '24px' }} />}
          />
          <h1 className='font-bold text-xl'>{name}</h1>
        </div>
        <div className='flex-1 flex justify-end gap-3'>
          <Select
            placeholder={'Selectionnez la saison'}
            showSearch
            style={{ width: 200 }}
            filterOption={filterOption}
            value={filters.season}
            onChange={(val) => setFilters((prev) => ({ ...prev, season: val }))}
            options={seasons?.map((r) => ({
              label: r,
              value: r,
            }))}
          />
        </div>
      </div>
      <div>
        <Table
          loading={loading}
          dataSource={entities}
          columns={columns}
          pagination={false}
          scroll={{ x: 'scroll' }}
        />
      </div>
    </div>
  );
}

export default TeamStatPage;
