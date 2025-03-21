'use strict';

import _ from 'lodash';
import { Types } from 'mongoose';

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select) => {
  return Object.fromEntries(select.map((field) => [field, 1]));
};

const getUnselectData = (unselect) => {
  return Object.fromEntries(unselect.map((field) => [field, 0]));
};

const removeNullUndefinedProps = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => removeNullUndefinedProps(item));
  }

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [key, removeNullUndefinedProps(value)]),
  );
};

const convertToMongooesObjectId = (id) => {
  return new Types.ObjectId(id.toString());
};

export { convertToMongooesObjectId, getInfoData, getSelectData, getUnselectData, removeNullUndefinedProps };
