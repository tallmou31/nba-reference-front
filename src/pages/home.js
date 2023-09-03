import React, { useEffect, useState } from 'react';
import franchises from '../assets/fanchises.jpeg';
import { Badge, Card, Image, List, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getEntities } from '../redux/home.reducer';

function HomePage() {
  const homeData = useSelector((state) => state.home);
  const dispatch = useDispatch();
  const [allTimeBest, setAllTimeBest] = useState([]);
  useEffect(() => {
    dispatch(getEntities());
  }, [dispatch]);

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

  useEffect(() => {
    const data = [];
    if (homeData.bestPts) {
      data.push({
        ...homeData.bestPts,
        total: Math.round(homeData.bestPts.total) + ' points',
        label: 'Meilleur scoreur',
        color: 'cyan',
      });
    }
    if (homeData.bestAst) {
      data.push({
        ...homeData.bestAst,
        total: Math.round(homeData.bestAst.total) + ' passes',
        label: 'Meilleur passeur',
        color: 'green',
      });
    }
    if (homeData.bestReb) {
      data.push({
        ...homeData.bestReb,
        total: Math.round(homeData.bestReb.total) + ' rebonds',
        label: 'Meilleur reboundeur',
        color: 'purple',
      });
    }
    setAllTimeBest(data);
  }, [homeData]);

  return (
    <div>
      <div className='flex lg:flex-row md:flex-col items-start gap-5 bg-white p-3 md:items-center'>
        <Image src={franchises} width={300} height={200} />
        <div className='h-full flex-1'>
          <h1 className='font-bold text-xl text-center'>
            Bienvenue dans votre application référence de la NBA
          </h1>

          <p className='text-center mt-3'>
            Vous pouvez voir les statistiques des joueurs et des équipes NBA
            entre 1996 et 2021
          </p>
        </div>
      </div>

      <div className='p-3 bg-white mt-8'>
        <h1 className='text-center text-xl font-bold mb-5'>ALL TIME AWARDS</h1>
        <List
          className='list-team text-center'
          loading={homeData?.loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 3,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={allTimeBest}
          renderItem={(item) => (
            <List.Item className='h-full'>
              <Badge.Ribbon text={item.label} color={item.color}>
                <Card className='cursor-pointer h-full flex justify-center items-center flex-col gap-5'>
                  <h1 className='font-bold text-lg text-center'>{item._id}</h1>
                  <p className='text-md font-bold text-center italic'>
                    {item.total}
                  </p>
                  <p className='text-center'>
                    <Tag color='gold'>{item.seasons.length} saison(s)</Tag>
                  </p>
                  {getSeasonInterval(item.seasons)}
                </Card>
              </Badge.Ribbon>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default HomePage;
