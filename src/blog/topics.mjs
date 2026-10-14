import {projectContentTopics} from '../build/content-topics.mjs';
export function projectBlogTopics(options) {
  return projectContentTopics({...options,type:'blog',indexId:'page:blog-index',topicsPath:'src/blog/topics.json',labelPrefix:'blog-topic'});
}
