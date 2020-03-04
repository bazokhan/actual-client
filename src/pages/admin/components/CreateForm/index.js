import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { FaSpinner } from 'react-icons/fa';

const CreateForm = ({ gql, fields, queries }) => {
  const { register, handleSubmit, errors, reset } = useForm();
  const [createMutation, { loading, error }] = useMutation(gql, {
    refetchQueries: queries ? queries.map(query => ({ query })) : [],
    awaitRefetchQueries: true
  });
  const onSubmit = async values => {
    const handledValues = Object.keys(values).reduce((prev, key) => {
      const value = values[key];
      if (value === 'true') {
        return { ...prev, [key]: true };
      }
      if (value === 'false') {
        return { ...prev, [key]: false };
      }
      return { ...prev, [key]: value };
    }, {});
    try {
      await createMutation({ variables: handledValues });
      reset();
    } catch (err) {
      console.log(err);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <p>{error?.message?.replace('GraphQL error: ', '')}</p>}
      {fields.map(field => {
        if (field.type === 'text') {
          return (
            <label key={field.name} htmlFor={field.name}>
              <p>{field.label}</p>
              <input
                type="text"
                name={field.name}
                ref={register({ required: field.required })}
              />
              {errors[field.name] && <p>{field.label} is Required</p>}
            </label>
          );
        }
        if (field.type === 'select') {
          return (
            <label key={field.name} htmlFor={field.name}>
              <p>{field.label}</p>
              <select
                name={field.name}
                ref={register({ required: field.required })}
              >
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors[field.name] && <p>{field.label} is Required</p>}
            </label>
          );
        }
        if (field.type === 'radio') {
          return (
            <div key={field.name}>
              <p>{field.label}</p>
              {field.options.map(option => (
                <label key={option.value} htmlFor={option.label}>
                  <span>{option.label}</span>
                  <input
                    type="radio"
                    id={option.label}
                    name={field.name}
                    ref={register({ required: field.required })}
                    value={option.value}
                  />
                </label>
              ))}
              {errors[field.name] && <p>{field.label} is Required</p>}
            </div>
          );
        }
        return null;
      })}
      <button type="submit" disabled={loading}>
        {loading ? <FaSpinner /> : 'Create'}
      </button>
    </form>
  );
};

CreateForm.propTypes = {
  gql: PropTypes.object.isRequired,
  queries: PropTypes.array,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool.isRequired
    })
  ).isRequired
};

CreateForm.defaultProps = {
  queries: null
};

export default CreateForm;
