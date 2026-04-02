const customValidators = {
  file_created: (output) => output.includes('test.txt'),
  sandbox_exists: (output) => output.includes('sandbox'),
  permission_700: (output) => /rwx------/.test(output),
  process_running: (output) => output.includes('RUNNING'),
};

const check = (task, output) => {
  const { validation_type, validation_rule, expected_output } = task;

  switch (validation_type) {
    case 'exact':
      return output.trim() === expected_output.trim();

    case 'contains':
      return output.includes(expected_output);

    case 'regex':
      return new RegExp(validation_rule).test(output);

    case 'mcq':
      return String(output).trim() === String(expected_output).trim();

    case 'custom': {
      const fn = customValidators[validation_rule];
      return fn ? fn(output) : false;
    }

    default:
      return false;
  }
};

module.exports = { check };
