import InputNode from './InputNode';
import ProcessNode from './ProcessNode';
import ConditionNode from './ConditionNode';
import OutputNode from './OutputNode';
import EmailNode from './EmailNode';

export const nodeTypes = {
  input: InputNode,
  process: ProcessNode,
  condition: ConditionNode,
  output: OutputNode,
  email: EmailNode,
};

export {
  InputNode,
  ProcessNode,
  ConditionNode,
  OutputNode,
};