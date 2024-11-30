import { useEffect, useState } from 'react';
import CodeHighlight from '../../components/Highlight';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const tableData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@yahoo.com',
    date: '10/08/2020',
    sale: 120,
    status: 'Complete',
    register: '5 min ago',
    progress: '40%',
    position: 'Developer',
    office: 'London',
  },
  {
    id: 2,
    name: 'Shaun Park',
    email: 'shaunpark@gmail.com',
    date: '11/08/2020',
    sale: 400,
    status: 'Pending',
    register: '11 min ago',
    progress: '23%',
    position: 'Designer',
    office: 'New York',
  },
  {
    id: 3,
    name: 'Alma Clarke',
    email: 'alma@gmail.com',
    date: '12/02/2020',
    sale: 310,
    status: 'In Progress',
    register: '1 hour ago',
    progress: '80%',
    position: 'Accountant',
    office: 'Amazon',
  },
  {
    id: 4,
    name: 'Vincent Carpenter',
    email: 'vincent@gmail.com',
    date: '13/08/2020',
    sale: 100,
    status: 'Canceled',
    register: '1 day ago',
    progress: '60%',
    position: 'Data Scientist',
    office: 'Canada',
  },
];

const Settings = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Settings'));
  });
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  const [codeArr, setCodeArr] = useState<string[]>([]);
  const toggleCode = (name: string) => {
    if (codeArr.includes(name)) {
      setCodeArr((value) => value.filter((d) => d !== name));
    } else {
      setCodeArr([...codeArr, name]);
    }
  };
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
      {/* Simple */}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Settings Table</h5>
          <button type="button" onClick={() => toggleCode('code1')} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
            <span className="flex items-center">
              {allSvgs.htmlCodeIcon}
              Code
            </span>
          </button>
        </div>
        <div className="table-responsive mb-5">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Sale</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data) => {
                return (
                  <tr key={data.id}>
                    <td>
                      <div className="whitespace-nowrap">{data.name}</div>
                    </td>
                    <td>{data.date}</td>
                    <td>{data.sale}</td>
                    <td>
                      <div
                        className={`whitespace-nowrap ${
                          data.status === 'completed'
                            ? 'text-success'
                            : data.status === 'Pending'
                            ? 'text-secondary'
                            : data.status === 'In Progress'
                            ? 'text-info'
                            : data.status === 'Canceled'
                            ? 'text-danger'
                            : 'text-success'
                        }`}
                      >
                        {data.status}
                      </div>
                    </td>
                    <td className="text-center">
                      <Tippy content="Delete">
                        <button type="button">{allSvgs.delIconDefault}</button>
                      </Tippy>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {codeArr.includes('code1') && (
          <CodeHighlight>
            <pre className="language-typescript">
              {`import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const tableData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@yahoo.com',
        date: '10/08/2020',
        sale: 120,
        status: 'Complete',
        register: '5 min ago',
        progress: '40%',
        position: 'Developer',
        office: 'London',
    },
    {
        id: 2,
        name: 'Shaun Park',
        email: 'shaunpark@gmail.com',
        date: '11/08/2020',
        sale: 400,
        status: 'Pending',
        register: '11 min ago',
        progress: '23%',
        position: 'Designer',
        office: 'New York',
    },
    {
        id: 3,
        name: 'Alma Clarke',
        email: 'alma@gmail.com',
        date: '12/02/2020',
        sale: 310,
        status: 'In Progress',
        register: '1 hour ago',
        progress: '80%',
        position: 'Accountant',
        office: 'Amazon',
    },
    {
        id: 4,
        name: 'Vincent Carpenter',
        email: 'vincent@gmail.com',
        date: '13/08/2020',
        sale: 100,
        status: 'Canceled',
        register: '1 day ago',
        progress: '60%',
        position: 'Data Scientist',
        office: 'Canada',
    },
];

<div className="table-responsive mb-5">
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Sale</th>
                <th>Status</th>
                <th className="text-center">Action</th>
            </tr>
        </thead>
        <tbody>
            {tableData.map((data) => {
                return (
                    <tr key={data.id}>
                        <td>
                            <div className="whitespace-nowrap">{data.name}</div>
                        </td>
                        <td>{data.date}</td>
                        <td>{data.sale}</td>
                        <td>
                            <div
                                className={\`whitespace-nowrap \${
                                    data.status === 'completed'
                                        ? 'text-success'
                                        : data.status === 'Pending'
                                        ? 'text-secondary'
                                        : data.status === 'In Progress'
                                        ? 'text-info'
                                        : data.status === 'Canceled'
                                        ? 'text-danger'
                                        : 'text-success'
                                }\`}
                            >
                                {data.status}
                            </div>
                        </td>
                        <td className="text-center">
                            <Tippy content="Delete">
                                <button type="button">
                                    ${allSvgs.closeIconSvg}
                                </button>
                            </Tippy>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>
</div>`}
            </pre>
          </CodeHighlight>
        )}
      </div>
    </div>
  );
};

export default Settings;
