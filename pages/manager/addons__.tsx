<tbody>
{addonsData
  ?.filter(filteredAddon => filteredAddon.category === "Wedding Photography")
  .map((addons, index) => (
    <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90 ">
      <td className="min-w-[150px] font-sans text-black dark:text-white">
        <div className="flex items-start flex-col">
          <input
            title={addons?.title}
            {...register(`addons[${index}].title`)}
            defaultValue={addons?.title}
            className='border rounded p-3 focus:outline-none bg-gray-50 focus:border-gray-400 ms-12 md:ms-0 h-10 text-[13px]'
          />
        </div>
      </td>

      <td className="min-w-[150px] font-sans text-black dark:text-white">
        <div className="flex items-start flex-col">
          <input
            title={addons?.ExtendRateType}
            {...register(`addons[${index}].ExtendRateType`)}
            defaultValue={addons?.ExtendRateType ? addons?.ExtendRateType : "N/A"}
            className='border rounded p-3 focus:outline-none bg-gray-50 focus:border-gray-400 ms-12 md:ms-0 h-10 capitalize w-32 text-[13px]'
          />
        </div>
      </td>

      <td>
        <input
          type='number'
          {...register(`addons[${index}].ExtendRate`)}
          defaultValue={addons?.ExtendRate ? addons?.ExtendRate : 0}
          className='border rounded p-3 focus:outline-none bg-gray-50 focus:border-gray-400 ms-12 md:ms-0 w-24 h-10 text-[13px]'
        />
      </td>

      <td>
        <input
          type='number'
          {...register(`addons[${index}].rate`)}
          defaultValue={addons?.rate}
          className='border rounded text-gray-600 p-3 focus:outline-none bg-gray-50 focus:border-gray-400 ms-12 md:ms-0  w-24 h-10 text-[13px]'
        />
      </td>
      <td className={`font-sans text-gray-600 hover:text-green-500`}>
        {addons?.status ? <span className="badge badge-outline-success">Active</span> : <span className="badge badge-outline-success">Inactive</span>}
      </td>

      <td>
        <button type="submit" className="btn text-dark btn-outline-dark">Save</button>
      </td>
    </tr>
  ))}
</tbody>