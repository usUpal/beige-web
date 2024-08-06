import Link from 'next/link';
import Dropdown from '@/components/Dropdown';
import StatusBg from '@/components/Status/StatusBg';
import { API_ENDPOINT } from '@/config';
import { useEffect, useState } from 'react'
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
                fontSize: '29px'
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

  //Monthly Sales
  const dailySales: any = {
    series: [
      {
        name: 'Sales',
        data: [44, 55, 41, 67, 22, 43, 21, 56, 97, 88, 12, 67],
      },
      {
        name: 'Last Week',
        data: [13, 23, 20, 8, 13, 27, 33, 44, 55, 41, 67, 22],
      },
    ],
    options: {
      chart: {
        height: 160,
        type: 'bar',
        fontFamily: 'Nunito, sans-serif',
        toolbar: {
          show: false,
        },
        stacked: true,
        stackType: '100%',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
      },
      colors: ['#ACA686', '#e0e6ed'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        labels: {
          show: false,
        },
        categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      },
      yaxis: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
        xaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 10,
          right: -20,
          bottom: -20,
          left: -20,
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
                <Dropdown
                  offset={[0, 1]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  button={
                    allSvgs.revenueDayWkMonthSortBtnSvg
                  }
                >
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
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success-light text-success dark:bg-success dark:text-success-light">
                  {allSvgs.cartIconSvg}
                </div>
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

        {/* Summary and Total orders */}
        <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
          {/* Monthly Orders */}
          <div className="panel h-full sm:col-span-2 xl:col-span-1">
            <div className="mb-5 flex items-center">
              <h5 className="text-lg font-semibold dark:text-white-light">
                Monthly Orders
                <span className="block text-sm font-normal text-white-dark">Go to columns for details.</span>
              </h5>
              <div className="relative ltr:ml-auto rtl:mr-auto">
                <div className="grid h-11 w-11 place-content-center rounded-full bg-[#ffeccb] text-warning dark:bg-warning dark:text-[#ffeccb]">
                  {allSvgs.dolarIconSvg}
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-lg bg-white dark:bg-black">
                {isMounted ? (
                  <ReactApexChart series={dailySales.series} options={dailySales.options} type="bar" height={160} width={'100%'} />
                ) : (
                  <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="panel h-full sm:col-span-2 xl:col-span-1">
            <div className="mb-5 flex items-center justify-between dark:text-white-light">
              <h5 className="text-lg font-semibold">Summary</h5>
              <div className="dropdown">
                <Dropdown
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  button={
                    allSvgs.threeDotDropDown
                  }
                >
                  <ul>
                    <li>
                      <button type="button">View Report</button>
                    </li>
                    <li>
                      <button type="button">Edit Report</button>
                    </li>
                    <li>
                      <button type="button">Mark as Done</button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="space-y-9">
              <div className="flex items-center">
                <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                  <div className="grid h-9 w-9 place-content-center  rounded-full bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light">
                    {allSvgs.summaryIncomeIconSvg}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex font-semibold text-white-dark">
                    <h6>Income</h6>
                    <p className="ltr:ml-auto rtl:mr-auto">$92,600</p>
                  </div>
                  <div className="h-2 rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                    <div className="h-full w-11/12 rounded-full bg-gradient-to-r from-[#7579ff] to-[#b224ef]"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                  <div className="grid h-9 w-9 place-content-center rounded-full bg-success-light text-success dark:bg-success dark:text-success-light">
                    {allSvgs.summaryProfitIconSvg}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex font-semibold text-white-dark">
                    <h6>Profit</h6>
                    <p className="ltr:ml-auto rtl:mr-auto">$37,515</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-[#3cba92] to-[#0ba360]" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                  <div className="grid h-9 w-9 place-content-center rounded-full bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                    {allSvgs.summaryExpensesIconSvg}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex font-semibold text-white-dark">
                    <h6>Expenses</h6>
                    <p className="ltr:ml-auto rtl:mr-auto">$55,085</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-[#f09819] to-[#ff5858]" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
          <div className="panel h-full">
            <div className="mb-5 flex items-center justify-between dark:text-white-light">
              <h5 className="text-lg font-semibold">Transactions</h5>
              <div className="dropdown">
                <Dropdown
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  button={
                    allSvgs.threeDotDropDown
                  }
                >
                  <ul>
                    <li>
                      <button type="button">View Report</button>
                    </li>
                    <li>
                      <button type="button">Edit Report</button>
                    </li>
                    <li>
                      <button type="button">Mark as Done</button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div>
              <div className="space-y-6">
                <div className="flex">
                  <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-success-light text-base text-success dark:bg-success dark:text-success-light">
                    VS
                  </span>
                  <div className="flex-1 px-3">
                    <div>Video Shoot</div>
                    <div className="text-xs text-white-dark dark:text-gray-500">10 Jan 1:00PM</div>
                  </div>
                  <span className="whitespace-pre px-1 text-base text-success ltr:ml-auto rtl:mr-auto">+$36.11</span>
                </div>
                <div className="flex">
                  <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-warning-light text-warning dark:bg-warning dark:text-warning-light">IS</span>
                  <div className="flex-1 px-3">
                    <div>Image Shoot</div>
                    <div className="text-xs text-white-dark dark:text-gray-500">04 Jan 1:00PM</div>
                  </div>
                  <span className="whitespace-pre px-1 text-base text-danger ltr:ml-auto rtl:mr-auto">-$16.44</span>
                </div>
                <div className="flex">
                  <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-danger-light text-danger dark:bg-danger dark:text-danger-light">IS</span>
                  <div className="flex-1 px-3">
                    <div>Image Shoot</div>
                    <div className="text-xs text-white-dark dark:text-gray-500">10 Jan 1:00PM</div>
                  </div>
                  <span className="whitespace-pre px-1 text-base text-success ltr:ml-auto rtl:mr-auto">+$66.44</span>
                </div>
                <div className="flex">
                  <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light">WS</span>
                  <div className="flex-1 px-3">
                    <div>Wedding Shoot</div>
                    <div className="text-xs text-white-dark dark:text-gray-500">04 Jan 1:00PM</div>
                  </div>
                  <span className="whitespace-pre px-1 text-base text-danger ltr:ml-auto rtl:mr-auto">-$32.00</span>
                </div>
                <div className="flex">
                  <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-info-light text-base text-info dark:bg-info dark:text-info-light">CS</span>
                  <div className="flex-1 px-3">
                    <div>Commercial Shoot</div>
                    <div className="text-xs text-white-dark dark:text-gray-500">10 Jan 1:00PM</div>
                  </div>
                  <span className="whitespace-pre px-1 text-base text-success ltr:ml-auto rtl:mr-auto">+$10.08</span>
                </div>
                <div className="flex">
                  <span className="grid h-9 w-9 shrink-0 place-content-center rounded-md bg-primary-light text-primary dark:bg-primary dark:text-primary-light">VS</span>
                  <div className="flex-1 px-3">
                    <div>Video Shoot</div>
                    <div className="text-xs text-white-dark dark:text-gray-500">04 Jan 1:00PM</div>
                  </div>
                  <span className="whitespace-pre px-1 text-base text-danger ltr:ml-auto rtl:mr-auto">-$22.00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="panel h-full overflow-hidden border-0 p-0">
            <div className="min-h-[190px] bg-gradient-to-r from-[#EEBE43] to-[#6B510F] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center rounded-full bg-black/50 p-1 font-semibold text-white ltr:pr-3 rtl:pl-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="block h-8 w-8 rounded-full border-2 border-white/50 object-cover ltr:mr-1 rtl:ml-1" src="/assets/images/profile-34.jpeg" alt="avatar" />
                  Alan Green
                </div>
                <button type="button" className="flex h-9 w-9 items-center justify-between rounded-md bg-[#164F57] text-white hover:opacity-80 ltr:ml-auto rtl:mr-auto">
                  {allSvgs.plusIconSvg}
                </button>
              </div>
              <div className="flex items-center justify-between text-white">
                <p className="text-xl">Wallet Balance</p>
                <h5 className="text-2xl ltr:ml-auto rtl:mr-auto">
                  <span className="text-white-light">$</span>2953
                </h5>
              </div>
            </div>
            <div className="-mt-12 grid grid-cols-2 gap-2 px-8">
              <div className="rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]">
                <span className="mb-4 flex items-center justify-between dark:text-white">
                  Received
                  <svg className="h-4 w-4 text-success" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 15L12 9L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]">$97.99</div>
              </div>
              <div className="rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]">
                <span className="mb-4 flex items-center justify-between dark:text-white">
                  Spent
                  <svg className="h-4 w-4 text-danger" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]">$53.00</div>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-5">
                <span className="rounded-full bg-[#1b2e4b] px-4 py-1.5 text-xs text-white before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-white ltr:before:mr-2 rtl:before:ml-2">
                  Pending
                </span>
              </div>
              <div className="mb-5 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#515365]">Photo Shoot</p>
                  <p className="text-base">
                    <span>$</span> <span className="font-semibold">13.85</span>
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#515365]">Video Shoot</p>
                  <p className="text-base">
                    <span>$</span> <span className="font-semibold ">15.66</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-around px-2 text-center">
                <button type="button" className="btn btn-secondary ltr:mr-2 rtl:ml-2">
                  View Details
                </button>
                <button type="button" className="btn btn-success">
                  Pay Now $29.51
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders and Top Rated Producer */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="panel h-full w-full">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Recent Orders</h5>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Order Name</th>
                    <th>Price</th>
                    <th>Flie Status</th>
                    <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myShoots?.map((shoot: any) => (
                    <tr key={shoot.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="min-w-[150px] text-black dark:text-white">
                        <div className="flex items-center">
                          <span className="inline-block h-[32px] w-[32px] rounded-[8px] bg-[#BAE7FF] text-center text-[12px] uppercase leading-[32px] leading-none text-[#2196F3] ltr:mr-3 rtl:ml-3">
                            {shoot?.order_name.slice(0, 2)}
                          </span>
                          <p className="whitespace-nowrap">
                            {shoot?.order_name}
                            <span className="block text-xs text-[#888EA8]">{new Date(shoot?.shoot_datetimes[0]?.shoot_date_time).toDateString()}</span>
                          </p>
                        </div>
                      </td>
                      <td>$56.07</td>
                      <td className="text-success">Available</td>
                      <td>
                        <div className="">
                          <StatusBg>{shoot?.order_status}</StatusBg>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Rated Producer */}
          <div className="panel h-full w-full">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Top Rated Producer</h5>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr className="border-b-0">
                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                    <th>Ratings</th>
                    <th>Complition Rate</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                    <td className="min-w-[150px] text-black dark:text-white">
                      <div className="flex">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/is.svg" alt="avatar" />
                        <p className="whitespace-nowrap">
                          Photo Shoot
                          <span className="block text-xs text-primary">Digital</span>
                        </p>
                      </div>
                    </td>
                    <td>$168.09</td>
                    <td>$60.09</td>
                    <td>170</td>
                  </tr>
                  <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                    <td className="text-black dark:text-white">
                      <div className="flex">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/ps.svg" alt="avatar" />
                        <p className="whitespace-nowrap">
                          Video Shoot <span className="block text-xs text-warning">Faishon</span>
                        </p>
                      </div>
                    </td>
                    <td>$126.04</td>
                    <td>$47.09</td>
                    <td>130</td>
                  </tr>
                  <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                    <td className="text-black dark:text-white">
                      <div className="flex">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        \<img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/ws.svg" alt="avatar" />
                        <p className="whitespace-nowrap">
                          Wedding Shoot <span className="block text-xs text-danger">Accessories</span>
                        </p>
                      </div>
                    </td>
                    <td>$56.07</td>
                    <td>$20.00</td>
                    <td>66</td>
                  </tr>
                  <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                    <td className="text-black dark:text-white">
                      <div className="flex">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/cs.svg" alt="avatar" />
                        <p className="whitespace-nowrap">
                          Commercial Shoot <span className="block text-xs text-primary">Digital</span>
                        </p>
                      </div>
                    </td>
                    <td>$110.00</td>
                    <td>$33.00</td>
                    <td>35</td>
                  </tr>
                  <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                    <td className="text-black dark:text-white">
                      <div className="flex">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/is.svg" alt="avatar" />
                        <p className="whitespace-nowrap">
                          Photo Shoot <span className="block text-xs text-primary">Digital</span>
                        </p>
                      </div>
                    </td>
                    <td>$56.07</td>
                    <td>$26.04</td>
                    <td>30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default DashboardManager;
