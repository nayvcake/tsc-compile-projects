/**
 * @description This class was built to handle full bucket when there is excessive code change to avoid CPU overload.
 */
class FullLavaBucket {
  constructor() {

  }
}

/**
 * @description This class was built to load and carry the payload over the Typescript construct to bring up important classes like Full Lava Bucket.
 */
class BucketLava {
  constructor() {

  }
}

/**
 * @description This class is a hot load handler to load the buckets first before making the application restart.When the bucket is full we must get another bucket to wait
  for it to
  finally be emptied. That 's the logic.

 */
class Hotreload {
  constructor(tag = '') {
    this.tag = tag
    this.buckets = []
    this.restarting = {}
  }
}

/**
 * @description Exporting the important hot restart classes for hot dough applications and commands.
 */
module.exports.HotReloadUtils = {
  /**
   * @description This class was built to handle full bucket when there is excessive code change to avoid CPU overload.
   */
  FullLavaBucket,
  /**
   * @description This class was built to load and carry the payload over the Typescript construct to bring up important classes like Full Lava Bucket.
   */
  BucketLava,
  /**
   * @description This class is a hot load handler to load the buckets first before making the application restart.When the bucket is full we must get another bucket to wait
    for it to
    finally be emptied. That 's the logic.
  */
  Hotreload
}