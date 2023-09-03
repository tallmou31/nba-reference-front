import { SearchOutlined } from '@ant-design/icons';
import { Card, Input, List, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PlayerPage() {
  //const entities = useSelector((state) => state.player.entities);
  const [entities, setEntities] = useState([]);

  const [filter, setFilter] = useState('');
  //const loading = useSelector((state) => state.player.loading);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      filter,
    });
    axios
      .get(`/api/players?${params}`)
      .then(({ data }) => {
        setEntities(data);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  const getSeasonInterval = (seasons) => {
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

  return (
    <div>
      <div className='pt-3 mb-5 flex justify-between items-center'>
        <h1 className='font-bold text-xl'>Liste des joueurs</h1>
        <Input
          addonAfter={<SearchOutlined />}
          className='search-field'
          placeholder='Rechercher à partir de 3 lettres'
          onChange={(e) => {
            const currentValue = e.target.value;
            if (currentValue.length > 2) {
              setFilter(currentValue);
            } else {
              setFilter((prev) => (prev.length === 3 ? '' : prev));
            }
          }}
        />
      </div>
      <List
        className='list-team'
        loading={loading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 6,
        }}
        dataSource={entities}
        renderItem={(item) => (
          <List.Item className='h-full'>
            <Card
              className='cursor-pointer h-full flex justify-center items-center flex-col gap-5'
              onClick={() =>
                navigate({
                  pathname: '/players/byName',
                  search: `?${new URLSearchParams({
                    name: item._id,
                    returnUrl: 'players',
                  })}`,
                })
              }
            >
              <h1 className='font-bold text-lg text-center'>{item._id}</h1>
              <p className='text-center'>
                <Tag color='gold'>{item.seasons.length} saison(s)</Tag>
              </p>
              {getSeasonInterval(item.seasons)}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default PlayerPage;
