import Link from 'next/link';
import Dropdown from '@/components/Dropdown';
import StatusBg from '@/components/Status/StatusBg';
import { API_ENDPOINT } from '@/config';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const DashboardManager = (props: any) => {
  const { isDark, isRtl, isMounted } = props;

  //Revenue Chart
  const revenueChart: any = {
    series: [
      {
        name: 'Income',
        data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
      },
      {
        name: 'Expenses',
        data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
      },
    ],
    options: {
      chart: {
        height: 325,
        type: 'area',
        fontFamily: 'Nunito, sans-serif',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: 'smooth',
        width: 2,
        lineCap: 'square',
      },
      dropShadow: {
        enabled: true,
        opacity: 0.2,
        blur: 10,
        left: -7,
        top: 22,
      },
      colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
      markers: {
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 6,
            fillColor: '#1B55E2',
            strokeColor: 'transparent',
            size: 7,
          },
          {
            seriesIndex: 1,
            dataPointIndex: 5,
            fillColor: '#E7515A',
            strokeColor: 'transparent',
            size: 7,
          },
        ],
      },
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: true,
        },
        labels: {
          offsetX: isRtl ? 2 : 0,
          offsetY: 5,
          style: {
            fontSize: '12px',
            cssClass: 'apexcharts-xaxis-title',
          },
        },
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          offsetX: isRtl ? -30 : -10,
          offsetY: 0,
          style: {
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-title',
          },
        },
        opposite: !!isRtl,
      },
      grid: {
        borderColor: isDark ? '#191E3A' : '#E0E6ED',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '16px',
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      tooltip: {
        marker: {
          show: true,
        },
        x: {
          show: false,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: isDark ? 0.19 : 0.28,
          opacityTo: 0.05,
          stops: isDark ? [100, 100] : [45, 100],
        },
      },
    },
  };

  //Sales By Category
  const salesByCategory: any = {
    series: [985, 737, 270],
    options: {
      chart: {
        type: 'donut',
        height: 460,
        fontFamily: 'Nunito, sans-serif',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 25,
        colors: isDark ? '#0e1726' : '#fff',
      },
      colors: isDark ? ['#5c1ac3', '#ACA686', '#e7515a', '#ACA686'] : ['#ACA686', '#5c1ac3', '#e7515a'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        height: 50,
        offsetY: 20,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '29px',
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '26px',
                color: isDark ? '#bfc9d4' : undefined,
                offsetY: 16,
              },
              total: {
                show: true,
                label: 'Total',
                color: '#888ea8',
                fontSize: '29px',
              },
            },
          },
        },
      },
      labels: ['Commercial', 'Wedding', 'Personal'],
      states: {
        hover: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
      },
    },
  };

  //Total Orders
  const totalOrders: any = {
    series: [
      {
        name: 'Sales',
        data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40, 28, 40, 36, 52, 38, 60, 38, 52, 36, 40],
      },
    ],
    options: {
      chart: {
        height: 290,
        type: 'area',
        fontFamily: 'Nunito, sans-serif',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      colors: isDark ? ['#00ab55'] : ['#00ab55'],
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      yaxis: {
        min: 0,
        show: false,
      },
      grid: {
        padding: {
          top: 125,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      fill: {
        opacity: 1,
        type: 'gradient',
        gradient: {
          type: 'vertical',
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [100, 100],
        },
      },
      tooltip: {
        x: {
          show: false,
        },
      },
    },
  };

  // Shoots
  const [myShoots, setMyShoots] = useState<any>([]);

  useEffect(() => {
    getAllMyShoots();
  }, []);

  const getAllMyShoots = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}orders?sortBy=createdAt:desc&limit=5`);
      const allShots = await response.json();
      setMyShoots((prevShoots: any) => {
        const newShoots = allShots.results.filter((shoot: any) => !prevShoots.some((prevShoot: any) => prevShoot.id === shoot.id));
        return [...prevShoots, ...newShoots];
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/" className="text-primary hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Manager</span>
        </li>
      </ul>

      <div className="pt-5">
        <div className="mb-6 grid gap-6 xl:grid-cols-3">
          <div className="panel h-full xl:col-span-2">
            <div className="mb-5 flex items-center justify-between dark:text-white-light">
              <h5 className="text-lg font-semibold">Revenue</h5>
              <div className="dropdown">
                <Dropdown offset={[0, 1]} placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`} button={allSvgs.revenueDayWkMonthSortBtnSvg}>
                  <ul>
                    <li>
                      <button type="button">Weekly</button>
                    </li>
                    <li>
                      <button type="button">Monthly</button>
                    </li>
                    <li>
                      <button type="button">Yearly</button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <p className="text-lg dark:text-white-light/90">
              Total Profit <span className="ml-2 text-[#ACA686]">$10,840</span>
            </p>
            <div className="relative">
              <div className="rounded-lg bg-white dark:bg-black">
                {isMounted ? (
                  <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} width={'100%'} />
                ) : (
                  <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="panel h-full">
            <div className="mb-5 flex items-center">
              <h5 className="text-lg font-semibold dark:text-white-light">Orders By Category</h5>
            </div>
            <div>
              <div className="rounded-lg bg-white dark:bg-black">
                {isMounted ? (
                  <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                ) : (
                  <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <div className="panel h-full p-0">
            <div className="absolute flex w-full items-center justify-between p-5">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success-light text-success dark:bg-success dark:text-success-light">{allSvgs.cartIconSvg}</div>
              </div>
              <h5 className="text-2xl font-semibold ltr:text-right rtl:text-left dark:text-white-light">
                3,192
                <span className="block text-sm font-normal">Total Orders</span>
              </h5>
            </div>
            <div className="rounded-lg bg-transparent">
              {/* loader */}
              {isMounted ? (
                <ReactApexChart series={totalOrders.series} options={totalOrders.options} type="area" height={290} width={'100%'} />
              ) : (
                <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                  <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardManager;
