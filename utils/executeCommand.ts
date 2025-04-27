import { exec } from 'child_process';

export const execCommand = async (
  command: string
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stdin) => {
      if (error) {
        console.log(error);
        reject({ success: false, message: error.message });
      }
      resolve({ success: true, message: stdout });
    });
  });
};
