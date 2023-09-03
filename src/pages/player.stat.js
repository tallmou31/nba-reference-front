import { Button, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getEntities } from '../redux/player.stats.reducer';
import { LeftCircleOutlined } from '@ant-design/icons';

function PlayerStatPage() {
  const [searchParams] = useSearchParams();

  const entities = useSelector((state) => state.playerStats.entities);
  const loading = useSelector((state) => state.playerStats.loading);
  const [name, setName] = useState('');
  const [returnUrl, setReturnUrl] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const name = searchParams.get('name');
    setReturnUrl(searchParams.get('returnUrl'));
    setName(name);
    dispatch(getEntities(name));
  }, [dispatch, searchParams]);

  const columns = useMemo(() => {
    const result = [
      {
        title: 'Saison',
        dataIndex: 'season',
        key: 'season',
      },
      {
        title: 'Equipe',
        dataIndex: 'team_abbreviation',
        key: 'team_abbreviation',
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
    ];

    return result;
  }, []);

  const getInfoDraft = useMemo(() => {
    if (entities && entities.length > 0) {
      const info = entities[0];
      if (!info.draft_year) {
        return <span>Non drafté</span>;
      } else {
        return (
          <span>
            {info.draft_year} - {info.draft_round}e Tour - {info.draft_number}e
            Position
          </span>
        );
      }
    } else {
      return <></>;
    }
  }, [entities]);

  return (
    <div>
      <div className='pt-3 mb-5 flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          {returnUrl && (
            <Button
              type='text'
              title='Retour'
              onClick={() => {
                if (returnUrl === 'players') {
                  window.location.href = '/players';
                } else {
                  if (returnUrl === 'stats') {
                    navigate('/stats');
                  } else {
                    navigate({
                      pathname: '/teams/byName',
                      search: `?${new URLSearchParams({ name: returnUrl })}`,
                    });
                  }
                }
              }}
              icon={<LeftCircleOutlined style={{ fontSize: '24px' }} />}
            />
          )}
          <h1 className='font-bold text-xl'>{name}</h1>
        </div>
        <p>
          <span className='font-bold'>Info Draft : </span> {getInfoDraft}
        </p>
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

export default PlayerStatPage;
